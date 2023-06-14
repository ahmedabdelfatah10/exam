import { Link } from 'react-router-dom';
import { ExamContext, ExamContextInterface } from '../../App';
import { useContext } from 'react';

export function Home() {
  const { exam, setExam } = useContext(ExamContext);

  return (
    <>
      <button>
        <Link to={'/question/' + exam.currentQuestion.id}>start Exam</Link>
      </button>
    </>
  );
}
