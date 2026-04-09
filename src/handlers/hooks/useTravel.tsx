import { useCallback } from "react";
import useGameContext from "../../context/hooks/useGameContext";
import {
	type ConnectionSafety,
	type Region,
	getEffectiveSafety,
} from "../../models/Location";
import { getDistance, humanizeDistance } from "../../utils/distance";
import progressTime from "../tools/progressTime";
import { formatTime, formatElapsed, isNight } from "../../utils/time";

// TODO: We can definitely tidy this up.
// TODO: Additionally, we should use a fourth type of message: a Travel message which may be its own component, or a
//       custom XML element that can display travel information such that the system information that the LLM actually
//       reads is hidden from the player.

const WALKING_SPEED_KMH = 5;
const MAX_BLOCK_HOURS = 3;
const METERS_PER_HOUR = WALKING_SPEED_KMH * 1000;

const EVENT_CHANCES: Record<ConnectionSafety, number> = {
	safe: 0.02,
	cautious: 0.05,
	dangerous: 0.1,
	perilous: 0.25,
	lethal: 0.5,
};

type TravelBlockResult =
	| { type: "uneventful"; hoursElapsed: number; distanceCovered: number }
	| {
			type: "danger" | "random_event";
			hoursElapsed: number;
			distanceCovered: number;
	  }
	| { type: "arrived"; hoursElapsed: number; distanceCovered: number };

function rollTravelBlock(
	remaining: number,
	safety: ConnectionSafety,
): TravelBlockResult {
	const hoursToDestination = remaining / METERS_PER_HOUR;
	const blockHours = Math.min(MAX_BLOCK_HOURS, hoursToDestination);

	const dangerChance = EVENT_CHANCES[safety];
	const randomEventChance = EVENT_CHANCES[safety];

	const dangerTriggered = Math.random() < dangerChance;
	const randomTriggered = Math.random() < randomEventChance;

	// An event can interrupt travel, and danger takes precedence.

	if (dangerTriggered || randomTriggered) {
		const hoursBeforeEvent = Math.random() * blockHours;
		const distanceCovered = hoursBeforeEvent * METERS_PER_HOUR;

		return {
			type: dangerTriggered ? "danger" : "random_event",
			hoursElapsed: hoursBeforeEvent,
			distanceCovered,
		};
	}

	if (hoursToDestination <= MAX_BLOCK_HOURS) {
		return {
			type: "arrived",
			hoursElapsed: hoursToDestination,
			distanceCovered: remaining,
		};
	}

	const distanceCovered = blockHours * METERS_PER_HOUR;

	return {
		type: "uneventful",
		hoursElapsed: blockHours,
		distanceCovered,
	};
}

export default function useTravel() {
	const { playerState, updatePlayerState, gameState, addMessage, regions } =
		useGameContext();

	const applyTravelBlock = useCallback(
		async (
			result: TravelBlockResult,
			origin: NonNullable<NonNullable<typeof playerState>["location"]>,
			destination: Region,
			currentDistance: number,
		) => {
			const newDistance = currentDistance + result.distanceCovered;

			const currentHour = playerState?.time?.hour ?? 12;
			const currentMinute = playerState?.time?.minute ?? 0;
			const elapsedFullHours = Math.floor(result.hoursElapsed);
			const elapsedMinutes = Math.round(
				(result.hoursElapsed - elapsedFullHours) * 60,
			);

			const newTime = progressTime(
				currentHour,
				currentMinute,
				elapsedFullHours,
				elapsedMinutes,
			);

			const baseSafety = origin.transitBaseSafety ?? "safe";
			const effectiveSafety = getEffectiveSafety(baseSafety, currentHour);
			const safetyLabel =
				effectiveSafety.charAt(0).toUpperCase() + effectiveSafety.slice(1);

			if (result.type === "arrived") {
				await updatePlayerState({
					location: {
						region: destination,
						building: null,
						transitRegion: undefined,
						transitDistance: undefined,
						transitTotalDistance: undefined,
						transitBaseSafety: undefined,
						hoursSlept: undefined,
					},
					time: newTime,
				});

				const lines = [
					"## Travel: Arrived",
					`The player has **arrived at ${destination.name}**.`,
					`- **Time arrived:** ${formatTime(newTime.hour, newTime.minute)}`,
					`- **Distance traveled:** ${humanizeDistance(result.distanceCovered)}`,
				];

				await addMessage({
					role: "system",
					content: lines.join("\n\n"),
					sentAt: new Date(),
				});
			} else {
				const totalDistance = origin.transitTotalDistance ?? 0;
				const distanceRemaining = totalDistance - newDistance;

				await updatePlayerState({
					location: {
						...origin,
						transitDistance: newDistance,
					},
					time: newTime,
				});

				if (result.type === "danger") {
					const lines = [
						"## Travel: Danger",
						`While traveling toward **${destination.name}**, the player encountered a **dangerous situation** on the road.`,
						`- **Road safety:** ${safetyLabel}`,
						`- **Time stopped:** ${formatTime(newTime.hour, newTime.minute)}`,
						`- **Duration:** ${formatElapsed(result.hoursElapsed)}`,
						`- **Distance traveled:** ${humanizeDistance(result.distanceCovered)}`,
						`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
						"The player is now stopped and must deal with this before continuing.",
					];

					await addMessage({
						role: "system",
						content: lines.join("\n\n"),
						sentAt: new Date(),
					});
				} else if (result.type === "random_event") {
					const lines = [
						"## Travel: Event",
						`While traveling toward **${destination.name}**, something **unexpected but not dangerous happened** on the road.`,
						`- **Road safety:** ${safetyLabel}`,
						`- **Time stopped:** ${formatTime(newTime.hour, newTime.minute)}`,
						`- **Duration:** ${formatElapsed(result.hoursElapsed)}`,
						`- **Distance traveled:** ${humanizeDistance(result.distanceCovered)}`,
						`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
						"The player is now stopped.",
					];

					await addMessage({
						role: "system",
						content: lines.join("\n\n"),
						sentAt: new Date(),
					});
				} else {
					const lines = [
						"## Travel: Uneventful",
						`The player traveled toward **${destination.name}** without incident.`,
						`- **Road safety:** ${safetyLabel}`,
						`- **Time stopped:** ${formatTime(newTime.hour, newTime.minute)}`,
						`- **Duration:** ${formatElapsed(result.hoursElapsed)}`,
						`- **Distance traveled:** ${humanizeDistance(result.distanceCovered)}`,
						`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
						"They are resting before continuing.",
					];

					await addMessage({
						role: "system",
						content: lines.join("\n\n"),
						sentAt: new Date(),
					});
				}
			}

			return result;
		},
		[playerState, updatePlayerState, addMessage],
	);

	const beginTravel = useCallback(
		async (destinationRegionId: number) => {
			if (!playerState?.location?.region) {
				return;
			}

			const destination = regions.find((r) => r.id === destinationRegionId);
			if (!destination) {
				return;
			}

			const rawDistance = getDistance(playerState.location.region, destination);
			const totalDistance = rawDistance * (gameState?.scale ?? 1);

			const baseSafety: ConnectionSafety =
				playerState.location.region.connectionSafety?.[destinationRegionId] ??
				"safe";
			const safety = getEffectiveSafety(
				baseSafety,
				playerState.time?.hour ?? 12,
			);

			const result = rollTravelBlock(totalDistance, safety);

			// Build the transit location state that beginTravel would have set.

			const transitLocation = {
				...playerState.location,
				transitRegion: destination,
				transitDistance: 0,
				transitTotalDistance: totalDistance,
				transitBaseSafety: baseSafety,
			};

			await applyTravelBlock(result, transitLocation, destination, 0);

			return result;
		},
		[playerState, gameState, regions, applyTravelBlock],
	);

	const advanceTravel = useCallback(async () => {
		if (
			!playerState?.location?.transitRegion ||
			playerState.location.transitTotalDistance == null ||
			playerState.location.transitDistance == null
		) {
			return;
		}

		const destination = playerState.location.transitRegion;
		const currentDistance = playerState.location.transitDistance;
		const remaining =
			playerState.location.transitTotalDistance - currentDistance;
		const baseSafety: ConnectionSafety =
			playerState.location.transitBaseSafety ?? "safe";
		const safety = getEffectiveSafety(baseSafety, playerState.time?.hour ?? 12);

		const result = rollTravelBlock(remaining, safety);

		return applyTravelBlock(
			result,
			playerState.location,
			destination,
			currentDistance,
		);
	}, [playerState, applyTravelBlock]);

	const turnAround = useCallback(async () => {
		if (
			!playerState?.location?.transitRegion ||
			playerState.location.transitDistance == null ||
			playerState.location.transitTotalDistance == null
		) {
			return;
		}

		const origin = playerState.location.region;
		const distanceBack = playerState.location.transitDistance;
		const baseSafety = playerState.location.transitBaseSafety ?? "safe";
		const safety = getEffectiveSafety(baseSafety, playerState.time?.hour ?? 12);
		const safetyLabel = safety.charAt(0).toUpperCase() + safety.slice(1);

		await updatePlayerState({
			location: {
				region: playerState.location.transitRegion,
				building: null,
				transitRegion: origin,
				transitDistance: 0,
				transitTotalDistance: distanceBack,
				transitBaseSafety: baseSafety,
				hoursSlept: 0,
			},
		});

		await addMessage({
			role: "system",
			content: [
				"### Travel: Turned Around",
				`The player decided to turn around and head to **${origin.name}**. No time has passed.`,
				`- **Road safety:** ${safetyLabel}`,
				`- **Distance remaining:** ${humanizeDistance(distanceBack)}`,
			].join("\n\n"),
			sentAt: new Date(),
		});
	}, [playerState, updatePlayerState, addMessage]);

	const isInTransit =
		playerState?.location?.transitRegion != null &&
		playerState.location.transitTotalDistance != null;

	const isNightTime = isNight(playerState?.time?.hour ?? 12);

	const sleepOnRoad = useCallback(async () => {
		if (
			!playerState?.location?.transitRegion ||
			playerState.location.transitTotalDistance == null ||
			playerState.location.transitDistance == null
		) {
			return;
		}

		const destination = playerState.location.transitRegion;

		const baseSafety: ConnectionSafety =
			playerState.location.transitBaseSafety ?? "safe";
		const safety = getEffectiveSafety(baseSafety, playerState.time?.hour ?? 12);
		const safetyLabel = safety.charAt(0).toUpperCase() + safety.slice(1);

		const currentHour = playerState.time?.hour ?? 12;
		const currentMinute = playerState.time?.minute ?? 0;

		// Cap sleep: 9 hours total per night, and never wake past 8am.

		const timeAlreadySlept = playerState.location.hoursSlept ?? 0;
		const timeSleepRemaining = 9 - timeAlreadySlept;

		const hoursUntil8am = (() => {
			const fractionalHour = currentHour + currentMinute / 60;

			if (fractionalHour < 8) {
				return 8 - fractionalHour;
			}

			return 24 - fractionalHour + 8;
		})();

		const maxSleep = Math.min(timeSleepRemaining, hoursUntil8am);

		if (maxSleep <= 0) {
			return { type: "no_sleep" as const };
		}

		const dangerTriggered = Math.random() < EVENT_CHANCES[safety];
		const randomTriggered = Math.random() < EVENT_CHANCES[safety];

		const newTime =
			hoursUntil8am <= timeSleepRemaining
				? { hour: 8, minute: 0 }
				: progressTime(
						currentHour,
						currentMinute,
						Math.floor(maxSleep),
						Math.round((maxSleep % 1) * 60),
					);

		if (dangerTriggered || randomTriggered) {
			const hoursBeforeEvent = Math.random() * maxSleep;

			// Wake up at 8am if sleep or an event would wake the player past that.

			const actualHours = Math.min(hoursBeforeEvent, hoursUntil8am);

			const interruptedTime = progressTime(
				currentHour,
				currentMinute,
				Math.floor(actualHours),
				Math.round((actualHours % 1) * 60),
			);

			await updatePlayerState({
				time: interruptedTime,
				location: {
					...playerState.location,
					hoursSlept: timeAlreadySlept + actualHours,
				},
			});

			const eventType = dangerTriggered ? "danger" : "random_event";
			const totalDistance = playerState.location.transitTotalDistance;
			const distanceRemaining =
				totalDistance - (playerState.location.transitDistance ?? 0);

			if (eventType === "danger") {
				const lines = [
					"## Travel: Danger (Sleep)",
					`While sleeping on the road toward **${destination.name}**, the player was **woken by danger**.`,
					`- **Road safety:** ${safetyLabel}`,
					`- **Sleep started:** ${formatTime(currentHour, currentMinute)}`,
					`- **Woken at:** ${formatTime(interruptedTime.hour, interruptedTime.minute)}`,
					`- **Slept for:** ${formatElapsed(actualHours)}`,
					`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
					"The player must deal with this before continuing.",
				];

				await addMessage({
					role: "system",
					content: lines.join("\n\n"),
					sentAt: new Date(),
				});
			} else {
				const lines = [
					"## Travel: Event (Sleep)",
					`While sleeping on the road toward **${destination.name}**, something **unexpected but not dangerous happened**.`,
					`- **Road safety:** ${safetyLabel}`,
					`- **Sleep started:** ${formatTime(currentHour, currentMinute)}`,
					`- **Woken at:** ${formatTime(interruptedTime.hour, interruptedTime.minute)}`,
					`- **Slept for:** ${formatElapsed(actualHours)}`,
					`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
					"The player is now awake.",
				];

				await addMessage({
					role: "system",
					content: lines.join("\n\n"),
					sentAt: new Date(),
				});
			}

			return { type: eventType };
		} else {
			await updatePlayerState({
				time: newTime,
				location: {
					...playerState.location,
					hoursSlept: timeAlreadySlept + maxSleep,
				},
			});

			const totalDistance = playerState.location.transitTotalDistance;
			const distanceRemaining =
				totalDistance - (playerState.location.transitDistance ?? 0);

			const lines = [
				"## Travel: Rested",
				`The player slept on the road toward **${destination.name}** and woke up refreshed.`,
				`- **Road safety:** ${safetyLabel}`,
				`- **Sleep started:** ${formatTime(currentHour, currentMinute)}`,
				`- **Woke at:** ${formatTime(newTime.hour, newTime.minute)}`,
				`- **Slept for:** ${formatElapsed(maxSleep)}`,
				`- **Distance remaining:** ${humanizeDistance(distanceRemaining)}`,
			];

			await addMessage({
				role: "system",
				content: lines.join("\n\n"),
				sentAt: new Date(),
			});

			return { type: "rested" as const };
		}
	}, [playerState, updatePlayerState, addMessage]);

	const canSleep = (() => {
		if (!isNightTime || !isInTransit) {
			return false;
		}

		const alreadySlept = playerState?.location?.hoursSlept ?? 0;
		if (alreadySlept >= 9) {
			return false;
		}

		const hour = playerState?.time?.hour ?? 12;
		const minute = playerState?.time?.minute ?? 0;
		const fractionalHour = hour + minute / 60;
		const hoursUntil8am =
			fractionalHour < 8 ? 8 - fractionalHour : 24 - fractionalHour + 8;

		return Math.min(9 - alreadySlept, hoursUntil8am) > 0;
	})();

	return {
		beginTravel,
		advanceTravel,
		turnAround,
		sleepOnRoad,
		isInTransit,
		canSleep,
	};
}
