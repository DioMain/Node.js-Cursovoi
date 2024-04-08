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

function ImageInput({ butText , name, butWitdh="200px", inputId }) {
    let [newImage, setNewImage] = useState("");

	const onfileChanged = (evt) => {
		setNewImage(evt.target.value);
	}

    return (
        <Stack className="image-input-container" direction="row" spacing={4}>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} className="CButton0 image-input-button"
                style={{ width: `${butWitdh}` }}>
                {butText}
                <VisuallyHiddenInput name={name} id={inputId}  type="file" accept="image/png, image/jpeg" onChange={onfileChanged}/>
            </Button>
            {
                newImage !== "" && (
                    <h5 className='image-input-text' style={{ marginTop: "12px" }}>{newImage.split("C:\\fakepath\\")}</h5>
                )
            }
        </Stack>
    )
}

export default ImageInput;