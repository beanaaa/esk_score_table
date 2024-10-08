import React, { useState, useEffect } from 'react'
import { getScores } from '../utils/db'
import { BarChart, CheckCircle } from 'lucide-react'

export const CompletionRate: React.FC = () => {
  const [scores, setScores] = useState<any[]>([])
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [leagues, setLeagues] = useState<string[]>([])

  useEffect(() => {
    const fetchLeagues = async () => {
      const allScores = await getScores()
      const uniqueLeagues = [...new Set(allScores.map(score => score.league))]
      setLeagues(uniqueLeagues)
    }
    fetchLeagues()
  }, [])

  useEffect(() => {
    const fetchScores = async () => {
      if (selectedLeagues.length > 0) {
        const allScores = await getScores()
        const filteredScores = allScores.filter(score => selectedLeagues.includes(score.league))
        setScores(filteredScores)
      } else {
        setScores([])
      }
    }
    fetchScores()
  }, [selectedLeagues])

  const handleLeagueChange = (league: string) => {
    setSelectedLeagues(prev =>
      prev.includes(league)
        ? prev.filter(l => l !== league)
        : [...prev, league]
    )
  }

  const calculateCompletionRate = () => {
    const playerStats: { [key: string]: { completed: number, total: number } } = {}

    scores.forEach(score => {
      if (!playerStats[score.player]) {
        playerStats[score.player] = { completed: 0, total: 0 }
      }
      playerStats[score.player].total++
      if (score.completed) {
        playerStats[score.player].completed++
      }
    })

    return Object.entries(playerStats).map(([player, stats]) => ({
      player,
      completions: stats.completed,
      rate: (stats.completed / stats.total * 100).toFixed(2)
    })).sort((a, b) => Number(b.rate) - Number(a.rate))
  }

  const completionRates = calculateCompletionRate()

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <BarChart className="mr-2 text-blue-500" />
        완주 통계
      </h2>
      <div className="mb-6">
        <h3 className="font-bold mb-2">리그 선택 (다중 선택 가능):</h3>
        <div className="flex flex-wrap gap-2">
          {leagues.map(league => (
            <label key={league} className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              <input
                type="checkbox"
                checked={selectedLeagues.includes(league)}
                onChange={() => handleLeagueChange(league)}
                className="mr-2"
              />
              {league}
            </label>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-racing">
          <thead>
            <tr>
              <th>순위</th>
              <th>플레이어</th>
              <th>완주 횟수</th>
              <th>완주율</th>
            </tr>
          </thead>
          <tbody>
            {completionRates.map((rate, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{rate.player}</td>
                <td>{rate.completions}</td>
                <td className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${rate.rate}%` }}></div>
                  </div>
                  {rate.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}