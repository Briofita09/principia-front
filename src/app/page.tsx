"use client";
import { useEffect, useRef, useState } from "react";
import Brazil from "@react-map/brazil";
import axios from "axios";
import UploadForm from "@/components/uploadForm";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [data, setData] = useState<any[] | undefined>()
  const ufsBrasil = {
    'Acre': 'AC',
    'Alagoas': 'AL',
    'Amapá': 'AP',
    'Amazonas': 'AM',
    'Bahia': 'BA',
    'Ceará': 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    'Goiás': 'GO',
    'Maranhão': 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    'Pará': 'PA',
    'Paraíba': 'PB',
    'Paraná': 'PR',
    'Pernambuco': 'PE',
    'Piauí': 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    'Rondônia': 'RO',
    'Roraima': 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    'Sergipe': 'SE',
    'Tocantins': 'TO'
  };
  
  const handleSelect = (state: any) => {
    setSelectedState(state);
  };

  function renderGroup(key: string){
    switch(key) {
      case '1': 
        return 'Cidades até 20 mil habitantes'
      case '2':
        return 'Cidades entre 20 e 100 mil habitantes'
      case '3': 
        return 'Cidades entre 100 mil e 1 milhão de habitantes'
      default:
        return 'Cidadedes acima de 1 milhão de habitantes'
    }
  }

  useEffect(() => {
    async function getStateHistory() {
      try {
        if (selectedState !== null) {
          const history = await axios.get(`http://localhost:5000/state/${ufsBrasil[selectedState].toLowerCase()}`);
          setData(history.data);
        } else {
          setData([]);
        }
      } catch (err) {
        toast.error('Erro ao recuperar dados das pesquisas', {
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
      }
    }
    getStateHistory();
  }, [selectedState]);

  return (
    <div className="bg-gradient-center">
      <h1 className="pt-4 text-center font-bold text-3xl">Evolução da corrida eleitoral para presidente no Brasil</h1>
      <div className="flex  justify-center h-full mt-4">
        <div className="mt-4">
          <div className="ml-[250px] items-end">
            <Brazil
              size={1000}
              hoverColor="blue"
              type='select-single'
              hints={true}
              onSelect={handleSelect}
            />
            <div className="justify-self-center mr-[30%]">
              <UploadForm />
            </div>
          </div>
          
        </div>
        {selectedState && (
          <div className="mt-4 mb-8">
            <h2 className="mb-12">Evolução dos candidatos no estado {ufsBrasil[selectedState]}</h2>
            <div className="flex flex-wrap gap-5">
              {data && data.map((el, index) => {
                const state = Object.entries(el);
                const citiesGroup = state[0][1];

                let previousData = '';
                const grupos: any = [];


                Object.entries(citiesGroup).forEach(([key, value]) => {
                  const currentData = value.data;


                  if (currentData !== previousData) {
                    grupos.push(<h3 key={`data-${currentData}`} className="mb-2 font-bold text-center">Pesquisa {currentData}</h3>);
                    previousData = currentData;
                  }


                  grupos.push(
                    <div key={`grupo-${key}`} className="p-4 w-[300px] h-[124px] mb-2 font-roboto" style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '5px' }}>
                      <h4>{renderGroup(key)}:</h4>
                      {Object.entries(value.candidatos).map(([candidate, details]) => {

                        const formattedCandidato = candidate.charAt(0).toUpperCase() + candidate.slice(1).replace(/([A-Z])/g, ' $1').trim();
                        return (
                          <p key={candidate}>{formattedCandidato}: {details.porcentagem}%</p>
                        );
                      })}
                    </div>
                  );
                });

                return <div key={`state-${index}`}>{grupos}</div>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>



  );
};
