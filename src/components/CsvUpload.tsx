import React, { useState } from 'react';
import { addScore, removeScoresBatch } from '../utils/db';
import { Upload, RotateCcw } from 'lucide-react';

export const CsvUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [league, setLeague] = useState('');
  const [circuit, setCircuit] = useState('');
  const [lastUploadId, setLastUploadId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const processCSV = (text: string) => {
    const rows = text.split('\n');
    return rows.map(row => {
      const [player, score] = row.split(',').map(item => item.trim());
      const numScore = parseFloat(score);
      const isCompleted = !isNaN(numScore);
      return {
        player,
        score: isNaN(numScore) ? 0 : numScore,
        completed: isCompleted
      };
    });
  };

  const handleUpload = async () => {
    if (!file || !league || !circuit) {
      alert('파일, 리그명, 서킷명을 모두 입력해주세요.');
      return;
    }

    const text = await file.text();
    const data = processCSV(text);
    const uploadId = Date.now().toString(); // 고유한 업로드 ID 생성

    for (const item of data) {
      if (item.player) {  // 빈 행 무시
        await addScore({
          league,
          circuit,
          player: item.player,
          score: item.score,
          completed: item.completed,
          uploadId // 업로드 ID 추가
        });
      }
    }

    setLastUploadId(uploadId);
    alert('데이터가 성공적으로 업로드되었습니다.');
    setFile(null);
  };

  const handleUndo = async () => {
    if (lastUploadId) {
      await removeScoresBatch(lastUploadId);
      alert('마지막 업로드가 취소되었습니다.');
      setLastUploadId(null);
    } else {
      alert('취소할 수 있는 업로드가 없습니다.');
    }
  };

  return (
    <div className="card p-6 space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Upload className="mr-2 text-green-500" />
        CSV 파일 업로드
      </h2>
      <div>
        <label className="block mb-1 font-semibold">리그명:</label>
        <input
          type="text"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">서킷명:</label>
        <input
          type="text"
          value={circuit}
          onChange={(e) => setCircuit(e.target.value)}
          required
          className="input-field"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">CSV 파일:</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="input-field"
        />
      </div>
      <button onClick={handleUpload} className="btn-primary w-full">
        업로드
      </button>
      <button onClick={handleUndo} className="btn-secondary w-full flex items-center justify-center">
        <RotateCcw className="mr-2" size={18} />
        마지막 업로드 취소
      </button>
    </div>
  );
};