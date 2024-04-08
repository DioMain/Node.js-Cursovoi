import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import './../../css/DeveloperCreateGame.css'

import { useState } from 'react'
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import ButtonJoy from '@mui/joy/Button'

import { useSelector } from 'react-redux';

function DeveloperCreateGame() {
  let user = useSelector(state => state.user);

  if (user.init && !user.auth)
    window.location.replace('/');

  if (user.init && user.auth && user.data.role !== "DEVELOPER")
    window.location.replace('/');

  let [step, setStep] = useState(0);
  let [step0Data, setStep0Data] = useState({ name: "", description: "", tags: "", price: 0, isfree: false });
  let [step1Data, setStep1Data] = useState({ icon: undefined, catalog: undefined, libriary: undefined });
  let [step2Data, setStep2Data] = useState({ mainFile: undefined });
  let [error, setError] = useState("");

  let steps = ["Настройка данных", "Загрузка медиа", "Загрузка файла"];

  const uploadGame = () => {
    let formData = new FormData();

    formData.append('name', step0Data.name);
    formData.append('description', step0Data.description);
    formData.append('tags', step0Data.tags);
    formData.append('price', step0Data.isfree ? 0 : step0Data.price);
    formData.append('files', step1Data.icon[0]);
    formData.append('files', step1Data.catalog[0]);
    formData.append('files', step1Data.libriary[0]);
    formData.append('files', step2Data.mainFile[0]);

    fetch('/api/uploadgame', {
      method: "POST",
      body: formData
    })
      .then(raw => raw.json())
      .then(data => {
        if (data.ok) {
          window.location.replace('/developer');
        }
        else {
          if (data.error === 'jwt')
            window.location.replace('/');
          else 
            console.log(data.error);
        }
      });
  }

  const stepDataHandler = (field, value) => {
    console.log(`${field} ${value}`);

    switch (field) {
      case "name":
        setStep0Data({ name: value, description: step0Data.description, tags: step0Data.tags, price: step0Data.price, isfree: step0Data.isfree });
        break;
      case "description":
        setStep0Data({ name: step0Data.name, description: value, tags: step0Data.tags, price: step0Data.price, isfree: step0Data.isfree });
        break;
      case "tags":
        setStep0Data({ name: step0Data.name, description: step0Data.description, tags: value, price: step0Data.price, isfree: step0Data.isfree });
        break;
      case "price":
        setStep0Data({ name: step0Data.name, description: step0Data.description, tags: step0Data.tags, price: value, isfree: step0Data.isfree });
        break;
      case "isfree":
        setStep0Data({ name: step0Data.name, description: step0Data.description, tags: step0Data.tags, price: step0Data.price, isfree: value });
        break;
      case "icon":
        setStep1Data({ icon: value, catalog: step1Data.catalog, libriary: step1Data.libriary });
        break;
      case "catalog":
        setStep1Data({ icon: step1Data.icon, catalog: value, libriary: step1Data.libriary });
        break;
      case "libriary":
        setStep1Data({ icon: step1Data.icon, catalog: step1Data.catalog, libriary: value });
        break;
      case "mainFile":
        setStep2Data({ mainFile: value });
        break;
    }
  }

  const getStep = () => {
    switch (step) {
      case 0:
        return (<Step0 onChange={stepDataHandler} data={step0Data} />);
      case 1:
        return (<Step1 onChange={stepDataHandler} />);
      case 2:
        return (<Step2 onChange={stepDataHandler} />);
      case 3:
        uploadGame();
        return (
          <Stack>
            <LinearProgress />
          </Stack>
        )
      default:
        return (<div>...</div>);
    }
  }

  const nextStep = () => {
    switch (step) {
      case 0:
        {
          if (step0Data.name === '') {
            setError("Поле название пустое");
            return;
          }
        }
        break;
      case 1:
        {
          if (step1Data.icon === undefined) {
            setError("Иконка должна быть указана");
            return;
          }
          if (step1Data.catalog === undefined) {
            setError("Изображение для каталога должно быть указано");
            return;
          }
          if (step1Data.libriary === undefined) {
            setError("Изображение для библиотеки должно быть указано");
            return;
          }
        }
        break;
      case 2:
        {
          if (step2Data.mainFile === undefined) {
            setError("Фаил с игрой не указан");
            return;
          }
        }
        break;
    }

    setError("");

    setStep(step + 1);
  }

  const previewStep = () => {
    setStep(step - 1);
  }

  return (
    <div className='DCG-container'>
      <Stack>
        <Stepper activeStep={step} alternativeLabel className='DCG-Stepper'>
          {
            steps.map(label => (
              <Step key={label} className='DCG-Step'>
                <StepLabel className='DCG-Step-Label'>{label}</StepLabel>

              </Step>
            ))
          }
        </Stepper>

        <Stack className='DCG-Steps-container'>
          {getStep()}
        </Stack>

        <Stack direction={'row'} justifyContent={"space-between"}>

          <ButtonJoy variant='solid' color='neutral' disabled={step == 0 || step == 3} onClick={previewStep}>
            Назад
          </ButtonJoy>

          <ButtonJoy variant='solid' color='neutral' disabled={step == 3} onClick={nextStep}>
            Далее
          </ButtonJoy>

        </Stack>

        <Stack direction={'row'} justifyContent={"center"}
          style={{
            color: 'red'
          }}>
          {error}
        </Stack>

      </Stack>
    </div>
  )
}

export default DeveloperCreateGame;