import Button from '@mui/material/Button';
import { Stack } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useState } from "react";

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: -80,
	left: 10,
	whiteSpace: 'nowrap',
	width: 1,
});

function FileInput({ buttonText, style, mime, onChange = null, inputId = "" }) {
    let [newImage, setNewImage] = useState("");

	const onfileChanged = (evt) => {
		setNewImage(evt.target.value);

        if (onChange != null)
            onChange(evt.target.files);
	}

    return (
        <Stack className="image-input-container" direction="row" spacing={4}>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} className="CButton0 image-input-button"
                style={style}>
                {buttonText}
                <VisuallyHiddenInput id={inputId} type="file" accept={mime} onChange={onfileChanged}/>
            </Button>
            {
                newImage !== "" && (
                    <Stack direction={"column"} justifyContent={"center"}>
                        <h5 className='image-input-text'>{newImage.split("C:\\fakepath\\")}</h5>
                    </Stack>
                )
            }
        </Stack>
    )
}

export default FileInput;