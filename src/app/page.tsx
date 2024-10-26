"use client";
import { useEffect, useRef, useState } from "react";
import Brazil from "@react-map/brazil";
import axios from "axios";

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
  useEffect(() => {
    async function getStateHistory() {
      try {
        if (selectedState !== null) {
          const history = await axios.get(`http://localhost:5000/state/${ufsBrasil[selectedState].toLowerCase()}`);
          setData(history.data);
        } else {
          setData([]); // Limpa os dados se nenhum estado estiver selecionado
        }
      } catch (err) {
        console.log(err);
      }
    }
    getStateHistory();
  }, [selectedState]);

  return (
    <div className="flex mt-4 mr-4 ml-4">
      <div>
        <h1>Mapa do Brasil</h1>
        {selectedState && <p>Estado Selecionado: {ufsBrasil[selectedState]}</p>}
        <Brazil
          size={1200}
          hoverColor="orange"
          type='select-single'
          hints={true}
          onSelect={handleSelect}
        />
      </div>
      {selectedState && (
        <div>
          <h2>Evolução dos candidatos no estado {ufsBrasil[selectedState]}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {data && data.map((el, index) => {
              const state = Object.entries(el);
              const citiesGroup = state[0][1]; // Presumindo que `citiesGroup` está na primeira entrada

              let previousData = '';
              const grupos = []; // Array para armazenar os grupos renderizáveis

              // Iterando sobre cada número e pegando a porcentagem de cada candidato
              Object.entries(citiesGroup).forEach(([key, value]) => {
                const currentData = value.data;

                // Verifica se a data atual é diferente da anterior
                if (currentData !== previousData) {
                  grupos.push(<h3 key={`data-${currentData}`}>Pesquisa {currentData}</h3>);
                  previousData = currentData; // Atualiza a data anterior
                }

                // Adiciona o grupo com candidatos
                grupos.push(
                  <div key={`grupo-${key}`} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', flex: '1 1 200px' }}>
                    <h4>Grupo {key}:</h4>
                    {Object.entries(value.candidatos).map(([candidato, detalhes]) => {
                      // Formata o nome do candidato
                      const formattedCandidato = candidato.charAt(0).toUpperCase() + candidato.slice(1).replace(/([A-Z])/g, ' $1').trim();
                      return (
                        <p key={candidato}>{formattedCandidato}: {detalhes.porcentagem}%</p>
                      );
                    })}
                  </div>
                );
              });

              return <div key={`state-${index}`} style={{ flex: '1 1 250px' }}>{grupos}</div>; // Agrupa todos os grupos para a cidade atual
            })}
          </div>
        </div>
      )}
    </div>
  );
};
