import "./../css/UserEditor.css";
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from "@mui/material/Divider"
import { useSelector } from "react-redux";
import TextField from '@mui/material/TextField'
import ImageInput from "../Components/ImageInput";
import Textarea from '@mui/joy/Textarea';

function UserEditor() {
	let user = useSelector(state => state.user);

	if (!user.auth)
		return (<div>NOT AUTH</div>);

	let txtAreaValue = user.data.description;

	const editUser = () => {
		let userIcon = document.getElementById("userIcon");
		let nickname = document.getElementById("userNickname");

		let formData = new FormData();
		
		formData.append('userIcon', userIcon.files[0]);
		formData.append('userNickname', nickname.value);
		formData.append('userDescription', txtAreaValue);

		fetch("/api/edituser", {
			method: "POST",
			body: formData
		}).
			then(raw => raw.json()).
			then(data => {
				if (data.ok) {
					window.location.reload();
				}
				else {
					if (data.error === "jwt"){
						window.location.replace("/");
					}
				}
			}).
			catch(err => console.log(err));
	}

	return (
		<FormControl className="user-editor-container">
			<Stack>
				<Stack justifyContent="center" direction="row">
					<div className="user-editor-image-display">
						<img src={`/users/${user.data.id}/icon.png`} />
					</div>
				</Stack>
				<h3 style={{ textAlign: "center" }}>{user.data.name}</h3>
				<h5 style={{ textAlign: "center", margin: "10px", marginTop: "0px" }}>{user.data.email}</h5>
				<Divider style={{ marginBottom: "20px" }} />
				<h3 style={{ textAlign: "center", marginBottom: "20px" }}>Редактирование</h3>
				<Stack direction="column" spacing={2}>
					<ImageInput inputId="userIcon" butWitdh="223px" butText="Загрузить иконку" />
					<Stack direction="row" spacing={4}>
						<TextField id="userNickname" variant="outlined" defaultValue={user.data.name} size="small" />
						<h3 style={{ marginTop: "10px" }}>Никнейм</h3>
					</Stack>
					<h2 style={{ marginTop: "15px" }}>Описание</h2>
					<Textarea defaultValue={txtAreaValue} id="userDescription" placeholder="Описание" onChange={(evt) => {txtAreaValue = evt.target.value}}></Textarea>
				</Stack>
				<Stack style={{ marginTop: "15px" }} direction="row" justifyContent="end">
					<Button style={{ width: "15s0px" }} className="CButton0" onClick={editUser}>Подтвердить</Button>
				</Stack>
			</Stack>
		</FormControl>
	)
}

export default UserEditor;