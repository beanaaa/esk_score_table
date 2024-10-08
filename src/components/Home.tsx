import React, { useState, useEffect, useRef } from 'react'
import { getScores } from '../utils/db'
import { Trophy, ChevronUp, ChevronDown } from 'lucide-react'

interface Score {
  player: string
  circuit: string
  score: number
  league: string
}

interface PlayerScore {
  player: string
  totalScore: number
  circuitScores: { [key: string]: number | null }
}

type SortConfig = {
  key: string
  direction: 'ascending' | 'descending'
}

export const Home: React.FC = () => {
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([])
  const [selectedLeague, setSelectedLeague] = useState<string>('')
  const [leagues, setLeagues] = useState<string[]>([])
  const [circuits, setCircuits] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'totalScore', direction: 'descending' })
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const fetchLeagues = async () => {
      const allScores = await getScores()
      const uniqueLeagues = [...new Set(allScores.map(score => score.league))]
      setLeagues(uniqueLeagues)
      if (uniqueLeagues.length > 0) {
        setSelectedLeague(uniqueLeagues[0])
      }
    }
    fetchLeagues()
  }, [])

  useEffect(() => {
    const fetchScores = async () => {
      if (selectedLeague) {
        const allScores: Score[] = await getScores()
        const filteredScores = allScores.filter(score => score.league === selectedLeague)
        
        const uniqueCircuits = [...new Set(filteredScores.map(score => score.circuit))]
        setCircuits(uniqueCircuits)

        const scoresByPlayer: { [key: string]: PlayerScore } = {}

        const uniquePlayers = [...new Set(filteredScores.map(score => score.player))]
        uniquePlayers.forEach(player => {
          scoresByPlayer[player] = {
            player,
            totalScore: 0,
            circuitScores: Object.fromEntries(uniqueCircuits.map(circuit => [circuit, null]))
          }
        })

        filteredScores.forEach(score => {
          scoresByPlayer[score.player].totalScore += score.score
          scoresByPlayer[score.player].circuitScores[score.circuit] = score.score
        })

        setPlayerScores(Object.values(scoresByPlayer))
      }
    }
    fetchScores()
  }, [selectedLeague])

  const sortedPlayerScores = React.useMemo(() => {
    let sortableItems = [...playerScores]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'player') {
          return sortConfig.direction === 'ascending'
            ? a.player.localeCompare(b.player)
            : b.player.localeCompare(a.player)
        } else if (sortConfig.key === 'totalScore') {
          return sortConfig.direction === 'ascending'
            ? a.totalScore - b.totalScore
            : b.totalScore - a.totalScore
        } else {
          const aValue = a.circuitScores[sortConfig.key]
          const bValue = b.circuitScores[sortConfig.key]
          if (aValue === null && bValue === null) return 0
          if (aValue === null) return 1
          if (bValue === null) return -1
          return sortConfig.direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue
        }
      })
    }
    return sortableItems
  }, [playerScores, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortDirection = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />
    }
    return null
  }

  return (
    <div className="card p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Trophy className="mr-2 text-yellow-500" />
        ESK F1 커뮤니티 점수표
      </h1>
      <select
        className="input-field mb-6"
        value={selectedLeague}
        onChange={(e) => setSelectedLeague(e.target.value)}
      >
        {leagues.map(league => (
          <option key={league} value={league}>{league}</option>
        ))}
      </select>
      <div className="overflow-x-auto">
        <table className="table-racing w-full" ref={tableRef}>
          <colgroup>
            <col className="w-16" />
            <col className="w-40" />
            <col className="w-24" />
            {circuits.map((_, index) => (
              <col key={index} className="w-24" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-gray-800 text-white">순위</th>
              <th className="sticky left-16 z-10 bg-gray-800 text-white cursor-pointer" onClick={() => requestSort('player')}>
                플레이어 {getSortDirection('player')}
              </th>
              <th className="sticky left-56 z-10 bg-gray-800 text-white cursor-pointer" onClick={() => requestSort('totalScore')}>
                총점수 {getSortDirection('totalScore')}
              </th>
              {circuits.map(circuit => (
                <th key={circuit} className="bg-gray-800 text-white cursor-pointer" onClick={() => requestSort(circuit)}>
                  {circuit} {getSortDirection(circuit)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayerScores.map((playerScore, index) => (
              <tr key={index}>
                <td className="sticky left-0 z-10 bg-white">{index + 1}</td>
                <td className="sticky left-16 z-10 bg-white">{playerScore.player}</td>
                <td className="sticky left-56 z-10 bg-white font-bold">{playerScore.totalScore}</td>
                {circuits.map(circuit => (
                  <td key={circuit} className="bg-white text-center">
                    {playerScore.circuitScores[circuit] !== null
                      ? playerScore.circuitScores[circuit]
                      : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}