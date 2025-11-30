import { useContext, useState } from "react";
import { LoginContext } from "./ContextProvider";
import ProfileAdmin from "./ProfileAdmin";
import ProfileCompany from "./ProfileCompany";
import ProfileStudent from "./ProfileStudent";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
    const { user } = useContext(LoginContext);
    const [usr, setUsr] = useState(user == null ? null : jwtDecode(user));
    return (
        <>
            {usr.role == "tnp" ? (
                <ProfileAdmin usr={usr}/>
            ) : (
                usr.role == "company" ? (
                    <ProfileCompany usr={usr}/>
                ) : (
                    <ProfileStudent usr={usr} />
                )
            )}
        </>
    )
}