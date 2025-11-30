import { toast } from "react-toastify";

export const API = "http://localhost:6969/api"
export const localStorageName = "ai-powered-placement-hub-user"

export const primaryBtnStyle = "text-white bg-blue-500 py-1 px-3 rounded-md cursor-pointer"
export const dangerBtnStyle = "text-white bg-red-600 py-1 px-3 rounded-md cursor-pointer";
export const navStyle = "shadow shadow-gray-700 py-3 mb-5 bg-[#DDF9F1] dark:bg-[#202020] flex gap-5 justify-center sticky top-0 right-0 left-0 z-10"
export const LinkStyle = "shadow shadow-black dark:shadow-none bg-gray-200 py-1 px-3 rounded-md dark:bg-gray-600";
export const headerStyle = "text-2xl underline"
export const formStyle = "shadow-md shadow-gray-500 dark:shadow-none bg-[#DDF9F1] dark:bg-[#202020] rounded-md border border-black dark:border-white w-[40%] mx-auto flex flex-col items-center gap-3 py-5"
export const formInputStyle = "shadow shadow-black bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-md";
export const tableStyle = "min-w-full rounded-lg shadow-sm border border-black";
export const thStyle = "px-4 py-2 text-left text-gray-600 dark:text-white uppercase text-sm border border-gray-500 dark:border-white";
export const tdStyle = "px-4 py-2 border border-gray-500 dark:border-white";
export const statusActive = "text-green-600 font-semibold";
export const statusInactive = "text-red-600 font-semibold";
export const statusPending = "text-yellow-600 font-semibold";
export const profileFeature = "bg-cyan-400 dark:bg-cyan-800 flex justify-center items-center h-[70px] rounded border-2 dark:border-white"

export const ApplyForJob = (sid, jid) => {
    fetch(`${API}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentId: sid,
            jobId: jid
        })
    }).then(res => res.json()).then(data => {
        if (data.status == "success") {
            alert("Applied Successfully")
            return
        }
        if (data.status == "error") {
            alert(data.message)
            return
        }
        console.log(data)
    })
}

export function openSection(e) {
    e.current.classList.remove('scale-0')
    e.current.classList.add('scale-100')
}

export function closeSection(e) {
    e.current.classList.remove('scale-100')
    e.current.classList.add('scale-0')
}

export function showAppliedStudents(job_id, ref, studentDetailsRef) {
    const e = ref.current.querySelector('div>table')
    e.innerText = ""
    fetch(`${API}/jobs/${job_id}/applications`).then(res => res.json()).then(data => {
        data.data.forEach(s => {
            const tr = document.createElement("tr")
            const td1 = document.createElement("td")
            td1.textContent = s.student.fullName
            td1.className += tdStyle

            const td2 = document.createElement("td")
            td2.textContent = s.student.branch
            td2.className += tdStyle

            const td3 = document.createElement("td")
            td3.textContent = s.student.batchYear
            td3.className += tdStyle

            const td4 = document.createElement("td")
            td4.textContent = s.student.cgpa
            td4.className += tdStyle

            const td5 = document.createElement("td")
            td5.textContent = s.student.resumeUrl
            td5.className += tdStyle

            const td6 = document.createElement("td")
            td6.textContent = s.student.user.email
            td6.className += tdStyle

            const btn1 = document.createElement("button")
            btn1.textContent = "Shortlist"
            btn1.className += primaryBtnStyle
            btn1.onclick = () => {
                const newStatus = "shortlisted";
                fetch(`${API}/applications/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        app_id: s.id,
                        status: newStatus
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Status updated:", data);
                        if (data.status == "success")
                            toast.success("Student Shortlisted");
                        else
                            toast.error("An Error Occurred");
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        alert("Failed to update status.");
                    });
            };


            const btn2 = document.createElement("button")
            btn2.textContent = "Reject"
            btn2.className += dangerBtnStyle
            btn2.onclick = () => {
                const newStatus = "rejected";
                fetch(`${API}/applications/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        app_id: s.id,
                        status: newStatus
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Status updated:", data);
                        if (data.status == "success")
                            toast.info("Student Rejected");
                        else
                            toast.error("An Error Occurred");
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        alert("Failed to update status.");
                    });
            };

            const btn3 = document.createElement("button")
            btn3.className += primaryBtnStyle
            btn3.onclick = () => {
                openSection(studentDetailsRef);
                showDetails(studentDetailsRef, s.student)
            }
            btn3.textContent = "View Details"


            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            tr.append(td4)
            tr.append(td5)
            tr.append(td6)
            tr.append(btn1)
            tr.append(btn2)
            tr.append(btn3)
            e.append(tr)
        })
    })
}

export function showShortlistedStudents(job_id, ref, studentDetailsRef) {
    const e = ref.current.querySelector('div>table')
    e.innerText = ""
    fetch(`${API}/jobs/${job_id}/applications/status/shortlisted`).then(res => res.json()).then(data => {
        data.data.forEach(s => {
            const tr = document.createElement("tr")
            const td1 = document.createElement("td")
            td1.textContent = s.student.fullName
            td1.className += tdStyle

            const td2 = document.createElement("td")
            td2.textContent = s.student.branch
            td2.className += tdStyle

            const td3 = document.createElement("td")
            td3.textContent = s.student.batchYear
            td3.className += tdStyle

            const td4 = document.createElement("td")
            td4.textContent = s.student.cgpa
            td4.className += tdStyle

            const td5 = document.createElement("td")
            td5.textContent = s.student.resumeUrl
            td5.className += tdStyle

            const td6 = document.createElement("td")
            td6.textContent = s.student.user.email
            td6.className += tdStyle

            const btn1 = document.createElement("button")
            btn1.textContent = "Select"
            btn1.className += primaryBtnStyle
            btn1.onclick = () => {
                const newStatus = "selected";
                fetch(`${API}/applications/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        app_id: s.id,
                        status: newStatus
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status == "success")
                            toast.success("Student Selected");
                        else {
                            console.log("Status updated:", data);
                            toast.error("An Error Occurred");
                        }
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        alert("Failed to update status.");
                    });
            };


            const btn2 = document.createElement("button")
            btn2.textContent = "Reject"
            btn2.className += dangerBtnStyle
            btn2.onclick = () => {
                const newStatus = "rejected";
                fetch(`${API}/applications/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        app_id: s.id,
                        status: newStatus
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Status updated:", data);
                        if (data.status == "success")
                            toast.info("Student Rejected");
                        else
                            toast.error("An Error Occurred");
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        alert("Failed to update status.");
                    });
            };

            const btn3 = document.createElement("button")
            btn3.className += primaryBtnStyle
            btn3.onclick = () => {
                openSection(studentDetailsRef);
                showDetails(studentDetailsRef, s.student)
            }
            btn3.textContent = "View Details"

            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            tr.append(td4)
            tr.append(td5)
            tr.append(td6)
            tr.append(btn1)
            tr.append(btn2)
            tr.append(btn3)
            e.append(tr)
        })
    })
}

export function showSelectedStudents(job_id, ref, studentDetailsRef) {
    const e = ref.current.querySelector('div>table')
    e.innerText = ""
    fetch(`${API}/jobs/${job_id}/applications/status/selected`).then(res => res.json()).then(data => {
        data.data.forEach(s => {
            const tr = document.createElement("tr")
            const td1 = document.createElement("td")
            td1.textContent = s.student.fullName
            td1.className += tdStyle

            const td2 = document.createElement("td")
            td2.textContent = s.student.branch
            td2.className += tdStyle

            const td3 = document.createElement("td")
            td3.textContent = s.student.batchYear
            td3.className += tdStyle

            const td4 = document.createElement("td")
            td4.textContent = s.student.cgpa
            td4.className += tdStyle

            const td5 = document.createElement("td")
            td5.textContent = s.student.resumeUrl
            td5.className += tdStyle

            const td6 = document.createElement("td")
            td6.textContent = s.student.user.email
            td6.className += tdStyle

            const btn1 = document.createElement("button")
            btn1.className += primaryBtnStyle
            btn1.onclick = ()=>{
                openSection(studentDetailsRef);
                showDetails(studentDetailsRef, s.student)
            }
            btn1.textContent = "View Details"


            tr.append(td1)
            tr.append(td2)
            tr.append(td3)
            tr.append(td4)
            tr.append(td5)
            tr.append(td6)
            tr.append(btn1)
            e.append(tr)
        })
    })
}

export function showDetails(ref, s) {
    const e = ref.current.querySelector('div>table')
    e.innerText = ""

    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    td1.textContent = s.fullName
    td1.className += tdStyle

    const td2 = document.createElement("td")
    td2.textContent = s.branch
    td2.className += tdStyle

    const td3 = document.createElement("td")
    td3.textContent = s.batchYear
    td3.className += tdStyle

    const td4 = document.createElement("td")
    td4.textContent = s.cgpa
    td4.className += tdStyle

    const td5 = document.createElement("td")
    td5.textContent = s.phoneNumber
    td5.className += tdStyle

    const td6 = document.createElement("td")
    td6.textContent = s.phoneNumber
    td6.className += tdStyle

    const td7 = document.createElement("td")
    td7.textContent = s.user.email
    td7.className += tdStyle



    tr.append(td1)
    tr.append(td2)
    tr.append(td3)
    tr.append(td4)
    tr.append(td5)
    tr.append(td6)
    tr.append(td7)
    e.append(tr)
}