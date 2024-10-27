import { useState, useRef } from "react"
import {
    FileUploadDropzone,
    FileUploadRoot,
} from "@/components/ui/file-button"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadForm() {
    const [file, setFile] = useState<any | undefined>(undefined)
    const [ready, setReady] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const ref = useRef<HTMLButtonElement>(null)

    function handleFileChange(newFile: any) {
        if (newFile.acceptedFiles[0].type === 'text/csv') {
            setFile(newFile)
            setReady(true)
        } else {
            setReady(false)
            setFile(undefined)
        }
    }

    async function handleFileUpload() {
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append('file', file.acceptedFiles[0])
            const res = await axios.post('http://localhost:5000/upload/pool', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Nova pesquisa enviada', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
                setFile(undefined)
            setLoading(false)
        } catch (err) {
            toast.error('Erro ao enviar a pesquisa!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
            setLoading(false)
        }
    }

    async function updateCenso() {
        setLoading(true)
        try {
            await axios.get('http://localhost:5000/upload/database')
            toast.success('Banco de dados atualizado', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
                setLoading(false)
        } catch (err) {
            toast.error('Erro ao atualziar o banco de dados', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col mb-[124px] -mt-20">
            <ToastContainer/>
            <FileUploadRoot maxW="sm" w='sm' alignItems="stretch" maxFiles={1} onFileChange={handleFileChange} >
                <div className="flex justify-between items-center">
                    {!file ? <h2 className="font-bold text-sm">Adicione uma nova pesquisa</h2> : <Button className="bg-green-400 rounded-md p-2" onClick={handleFileUpload} disabled={loading}>Enviar {file.acceptedFiles[0].name}</Button>}
                    <Button className="bg-green-400 p-2 rounded-md" onClick={updateCenso} disabled={loading}>Atualizar Censo</Button>
                </div>
                <FileUploadDropzone
                    label="Solte o arquivo da pesquisa aqui"
                    description="Apenas arquivos .csv"
                />
            </FileUploadRoot>
        </div>
    )
}