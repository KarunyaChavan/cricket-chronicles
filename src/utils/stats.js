import { formatValue } from './formatters'

/**
 * Aggregate career stats across all seasons for a given format type.
 * @param {Array} career - The player's career data array from API.
 * @param {string} type - The format type (e.g., 'Test', 'ODI').
 * @returns {object} Aggregated and formatted statistics.
 */
export const aggregateByType = (career, type) => {
	const entries = career.filter((c) => c.type === type)
	let totalMatches = 0
	let totalInnings = 0
	let totalRuns = 0
	let totalWickets = 0
	let totalBallsFaced = 0
	let totalHundreds = 0
	let totalFifties = 0
	let highestScore = 0
	let totalOvers = 0
	let totalRunsConceded = 0
	let totalInningsForAvg = 0
	let totalNotOuts = 0
	let totalFourX = 0
	let totalSixX = 0
	let totalMedians = 0

	entries.forEach((c) => {
		const b = c.batting || {}
		const bl = c.bowling || {}

		totalMatches += b.matches || 0
		totalInnings += b.innings || 0
		totalRuns += b.runs_scored || 0
		totalWickets += bl.wickets || 0
		totalBallsFaced += b.balls_faced || 0
		totalHundreds += b.hundreds || 0
		totalFifties += b.fifties || 0
		if ((b.highest_inning_score || 0) > highestScore) {
			highestScore = b.highest_inning_score
		}
		totalFourX += b.four_x || 0
		totalSixX += b.six_x || 0
		totalOvers += bl.overs || 0
		totalRunsConceded += bl.runs || 0
		totalMedians += bl.medians || 0
		totalInningsForAvg += b.innings || 0
		totalNotOuts += b.not_outs || 0
	})

	const dismissals = totalInningsForAvg - totalNotOuts
	const average = dismissals > 0 ? formatValue(totalRuns / dismissals) : '—'
	const batStrikeRate = totalBallsFaced > 0 ? formatValue((totalRuns / totalBallsFaced) * 100) : '—'
	const bowlStrikeRate = totalWickets > 0 ? formatValue((totalOvers * 6) / totalWickets) : '—'
	const economy = totalOvers > 0 ? formatValue(totalRunsConceded / totalOvers) : '—'

	return {
		matches: totalMatches,
		innings: totalInnings,
		runs: totalRuns,
		wickets: totalWickets,
		average,
		batStrikeRate,
		bowlStrikeRate,
		highestScore,
		hundreds: totalHundreds,
		fifties: totalFifties,
		fourX: totalFourX,
		sixX: totalSixX,
		ballsFaced: totalBallsFaced,
		overs: totalOvers > 0 ? parseFloat(totalOvers.toFixed(1)) : '—',
		economy,
		medians: totalMedians,
	}
}

/**
 * Compute overall aggregate across all career entries for the hero stats row.
 * @param {Array} career - The player's career data array.
 * @returns {object} Overall aggregate statistics.
 */
export const computeOverallStats = (career) => {
	let totalMatches = 0
	let totalRuns = 0
	let totalWickets = 0
	let totalInnings = 0
	let totalNotOuts = 0
	let totalFourX = 0
	let totalSixX = 0
	let totalOvers = 0
	let totalRunsConceded = 0

	career.forEach((c) => {
		const b = c.batting || {}
		const bl = c.bowling || {}
		totalMatches += b.matches || 0
		totalRuns += b.runs_scored || 0
		totalWickets += bl.wickets || 0
		totalInnings += b.innings || 0
		totalNotOuts += b.not_outs || 0
		totalFourX += b.four_x || 0
		totalSixX += b.six_x || 0
		totalOvers += bl.overs || 0
		totalRunsConceded += bl.runs || 0
	})

	const dismissals = totalInnings - totalNotOuts
	const average = dismissals > 0 ? formatValue(totalRuns / dismissals) : '—'
	const economy = totalOvers > 0 ? formatValue(totalRunsConceded / totalOvers) : '—'
	const strikeRate = totalWickets > 0 ? formatValue((totalOvers * 6) / totalWickets) : '—'

	return {
		matches: totalMatches,
		runs: totalRuns,
		wickets: totalWickets,
		average,
		fourX: totalFourX,
		sixX: totalSixX,
		economy,
		bowlStrikeRate: strikeRate,
	}
}
