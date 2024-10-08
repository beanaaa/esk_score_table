import React, { useState, useEffect } from 'react'
import { addScore, getScores } from '../utils/db'
import { PlusCircle } from 'lucide-react'

export const InputForm: React.FC = () => {
  const [formData, setFormData] = useState({
    league: '',
    circuit: '',
    player: '',
    score: '',
    completed: false
  })
  const [leagues, setLeagues] = useState<string[]>([])
  const [circuits, setCircuits] = useState<string[]>([])
  const [players, setPlayers] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const scores = await getScores()
      setLeagues([...new Set(scores.map(score => score.league))])
      setCircuits([...new Set(scores.map(score => score.circuit))])
      setPlayers([...new Set(scores.map(score => score.player))])
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    let newValue: string | boolean = value

    if (name === 'score') {
      newValue = value
      setFormData(prev => ({
        ...prev,
        completed: value !== ''
      }))
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addScore({
      ...formData,
      score: Number(formData.score)
    })
    alert('데이터가 저장되었습니다.')
    setFormData(prev => ({
      ...prev,
      player: '',
      score: '',
      completed: false
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <PlusCircle className="mr-2 text-red-500" />
        데이터 입력
      </h2>
      <div>
        <label className="block mb-1 font-semibold">리그명:</label>
        <input
          type="text"
          name="league"
          value={formData.league}
          onChange={handleChange}
          required
          className="input-field"
          list="leagues"
          autoComplete="off"
        />
        <datalist id="leagues">
          {leagues.map((league, index) => (
            <option key={index} value={league} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="block mb-1 font-semibold">서킷명:</label>
        <input
          type="text"
          name="circuit"
          value={formData.circuit}
          onChange={handleChange}
          required
          className="input-field"
          list="circuits"
          autoComplete="off"
        />
        <datalist id="circuits">
          {circuits.map((circuit, index) => (
            <option key={index} value={circuit} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="block mb-1 font-semibold">플레이어명:</label>
        <input
          type="text"
          name="player"
          value={formData.player}
          onChange={handleChange}
          required
          className="input-field"
          list="players"
          autoComplete="off"
        />
        <datalist id="players">
          {players.map((player, index) => (
            <option key={index} value={player} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="block mb-1 font-semibold">점수:</label>
        <input
          type="number"
          name="score"
          value={formData.score}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="font-semibold">완주 여부</span>
        </label>
      </div>
      <button type="submit" className="btn-primary w-full">저장</button>
    </form>
  )
}