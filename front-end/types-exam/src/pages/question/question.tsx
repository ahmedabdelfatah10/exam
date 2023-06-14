import { useNavigate, useParams } from 'react-router-dom';
import { useState, useContext, ChangeEvent } from 'react';
import { ExamContext, ExamContextInterface } from '../../App';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import './question.css';

export function Questions() {
  const { id } = useParams();

  return (
    <>
      <LinearWithValueLabel />
      <Question key={id} id={id} />
    </>
  );
}

function Question({ id }: { id: string | undefined }) {
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();
  const { exam, setExam } = useContext(ExamContext);
  const [status, setStatus] = useState(false);
  const [questionStatus,setQuestionStatus]=useState('')

  const handleValue = (e: ChangeEvent) => {
    setAnswer(e.target?.value);
  };

  const handleAnswer = () => {
    if (!status) {
      axios.post(`http://localhost:3000/${id}`, { answer }).then((res) => {
        if(res.data.answer=== 'correct'){
        setQuestionStatus('correct')
        }else{
          setQuestionStatus('wrong')
        }
        setExam((oldValue: ExamContextInterface) => {
          return {
            ...oldValue,
            next: oldValue.next + 1,
            score:
              res.data.answer === 'correct'
                ? oldValue.score + 10
                : oldValue.score,
          };
        });

        setStatus(true);
      });
    } else {
      if (exam.next <= 9) {
        navigate(`/question/${exam.Questions[exam.next].id}`);
        setExam((oldValue: ExamContextInterface) => {
          return {
            ...oldValue,
            currentQuestion: oldValue.Questions[exam.next],
            progress: oldValue.progress + 10,
          };
        });
      } else {
        navigate(`/finish`);
      }
    }
  };
  return (
    <>
    {questionStatus && (questionStatus === 'correct' ?  <h2 className='success'>Correct Answer</h2> :  <h2 className='error'>Wrong Answer</h2> )}
      <div className='parent'>
        <h1>Is {exam.currentQuestion.word} ?</h1>
        <div className='button'>
          <input
            type='radio'
            id='noun'
            name='wordType'
            value='noun'
            onChange={(e) => handleValue(e)}
          />
          <label className='btn btn-default'>noun</label>
        </div>
        <div className='button'>
          <input
            type='radio'
            id='verb'
            name='wordType'
            value='verb'
            onChange={(e) => handleValue(e)}
          />
          <label className='btn btn-default'>verb</label>
        </div>
        <div className='button'>
          <input
            type='radio'
            id='adverb'
            name='wordType'
            value='adverb'
            onChange={(e) => handleValue(e)}
          />
          <label className='btn btn-default'>adverb</label>
        </div>
        <div className='button'>
          <input
            type='radio'
            id='adjective'
            name='wordType'
            value='adjective'
            onChange={(e) => handleValue(e)}
          />
          <label className='btn btn-default'>adjective</label>
        </div>
      </div>
      <button className='btn-submit' onClick={handleAnswer}>
        {!status ? 'Submit' : 'next'}
      </button>
    </>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel() {
  const { exam, setExam } = useContext(ExamContext);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={exam.progress} />
    </Box>
  );
}
