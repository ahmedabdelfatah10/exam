import { useContext, useEffect, useState } from 'react';
import { ExamContext, ExamContextInterface } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function FinalScore() {
  const { exam, setExam } = useContext(ExamContext);
  const [rank, setRank] = useState(0);
  const navigate = useNavigate();
  const [tryAgain, setTryAgain] = useState(false);

  const fetchQuesions = () => {
    axios.get('http://localhost:3000').then((res) => {
      setExam((oldValue: ExamContextInterface) => {
        return {
          Questions: res.data,
          currentQuestion: res.data[0],
          progress: 0,
          next: 0,
          score: 0,
        };
      });
      setTryAgain(true);
    });
  };

  useEffect(() => {
    const data = { score: exam.score };
    axios.post('http://localhost:3000', data).then((res) => {
      setRank(res.data.rank);
    });
  }, []);

  useEffect(() => {
    if (tryAgain) {
      navigate('/question/' + exam.currentQuestion.id);
    }
  }, [tryAgain, navigate]);

  return (
    <>
      <h1>you finished</h1>
      {rank && <h2>your Rank is {rank}</h2>}
      <button onClick={fetchQuesions}>Try Again</button>
    </>
  );
}
