import Stack from '@mui/material/Stack'
import FileInput from '../Common/FileInput'

function Step1({ onChange }) {
  const iconHandle = (files) => {
    onChange("icon", files);
  }

  const catalogImageHandle = (files) => {
    onChange("catalog", files);
  }

  const libriaryImageHandle = (files) => {
    onChange("libriary", files);
  }

  return (
    <Stack direction={'column'} spacing={8}>
        <FileInput onChange={iconHandle} buttonText="Иконка" style={{ width: "260px" }} mime="image/png, image/jpeg"/>
        <FileInput onChange={catalogImageHandle} buttonText="Изображение в каталоге" style={{ width: "260px" }} mime="image/png, image/jpeg"/>
        <FileInput onChange={libriaryImageHandle} buttonText="Изображение в библиотеке" style={{ width: "260px" }} mime="image/png, image/jpeg"/>
    </Stack>
  )
}

export default Step1;