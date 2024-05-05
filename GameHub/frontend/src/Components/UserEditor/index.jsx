import "./../../css/UserEditor.css";
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from "@mui/material/Divider"
import { useSelector } from "react-redux";
import TextField from '@mui/material/TextField'
import FileInput from "../Common/FileInput";
import Textarea from '@mui/joy/Textarea';
import Confirm from "./../Common/Confirm";
import { useState } from "react";

function UserEditor() {
	let user = useSelector(state => state.user);

	let [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

	if (!user.auth)
		return (<div>NOT AUTH</div>);

	let txtAreaValue = user.data.description;

	const editUser = () => {
		let userIcon = document.getElementById("userIcon");
		let nickname = document.getElementById("userNickname");

		let formData = new FormData();

		const allowedImageMimes = "image/png,image/jpeg";

		if (userIcon.files[0] &&
			allowedImageMimes.split(',').some(i => i === userIcon.files[0].type))
			formData.append('userIcon', userIcon.files[0]);
		else
			formData.append('userIcon', undefined);
		
		formData.append('userNickname', nickname.value);
		formData.append('userDescription', txtAreaValue);

		fetch("/api/edituser", {
			method: "PUT",
			body: formData
		})
			.then(raw => raw.json())
			.then(data => {
				if (data.ok) {
					window.location.reload();
				}
				else {
					if (data.error === "jwt") {
						window.location.replace("/");
					}
				}
			})
			.catch(err => console.log(err));
	}

	const deleteUser = () => {
		fetch("/api/deleteuser", { method: "DELETE" })
			.then(raw => raw.json())
			.then(data => {
				if (data.ok) {
					window.location.replace('/');
				}
				else {
					if (data.error === "jwt")
						window.location.replace('/');
				}
			});
	}

	const logout = () => {
		window.location.assign('/api/logout');
	}

	return (
		<div className="user-editor-container">
			<Stack>
				<Stack justifyContent="center" direction="row">
					<div className="user-editor-image-display">
						<img src={`/users/${user.data.id}/icon.png`} style={{ objectFit: "cover"}}/>
					</div>
				</Stack>
				<h3 style={{ textAlign: "center" }}>{user.data.name}</h3>
				<h5 style={{ textAlign: "center", margin: "10px", marginTop: "0px" }}>{user.data.email}</h5>
				<Divider style={{ marginBottom: "20px" }} />
				<h3 style={{ textAlign: "center", marginBottom: "20px" }}>Редактирование</h3>
				<Stack direction="column" spacing={2}>
					<FileInput inputId="userIcon" buttonText="Загрузить иконку" mime={"image/png, image/jpeg"} />
					<Stack direction="row" spacing={4}>
						<TextField id="userNickname" variant="outlined" defaultValue={user.data.name} size="small" />
						<h3 style={{ marginTop: "10px" }}>Никнейм</h3>
					</Stack>
					<h2 style={{ marginTop: "15px" }}>Описание</h2>
					<Textarea defaultValue={txtAreaValue} id="userDescription" placeholder="Описание" onChange={(evt) => { txtAreaValue = evt.target.value }}></Textarea>
				</Stack>
				<Stack style={{ marginTop: "15px" }} direction="row" justifyContent="end">
					<Button style={{ width: "15s0px" }} className="CButton0" onClick={editUser}>Подтвердить</Button>
				</Stack>
				<Divider style={{ marginTop: "25px" }} />
				<Stack className="user-danger-zone" direction="row" justifyContent="space-between">
					<Button className="CButton-Error" variant="contained" onClick={() => setOpenDeleteConfirm(true)}>Удалить пользователя</Button>
					<Button className="CButton-Error" variant="contained" onClick={logout}>Выйти</Button>
				</Stack>
			</Stack>
			<Confirm open={openDeleteConfirm} text={"Вы действительно хотите удалить пользователя?"}
				onCancel={() => setOpenDeleteConfirm(false)} onConfirm={deleteUser} />
		</div>
	)
}

export default UserEditor;