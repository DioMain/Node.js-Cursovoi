import Stack from '@mui/material/Stack'
import FileInput from './../Common/FileInput'


function Step2({ onChange }) {
  const mainFileHandler = (files) => {
    onChange("mainFile", files);
  }

  return (
    <Stack direction={'column'}>
      <FileInput onChange={mainFileHandler} buttonText="Файл с игрой" style={{ width: "260px" }} mime=".zip, .rar, .exe" />
    </Stack>
  )
}

export default Step2;