# React componemt anatomy

1- **Imports** (no topo).

2- **Definições de Tipos/Interfaces** (se usar TypeScript).

3- **Hooks de Estado** (useState).

4- **Hooks de Referência** (useRef).

5- **Hooks de Efeito** (useEffect)
— ele muitas vezes sugere que efeitos fiquem juntos ou sejam movidos para Custom Hooks para não "poluir" a beleza visual do componente.

6- **Funções de Manipulação** (Handlers).

7- **JSX** (o retorno visual).

```JSX
// component
import React from 'react';
import { useUserProfile } from './hooks/useUserProfile';

// 1. Definição: O nome deve ser um substantivo claro
const UserDashboard = ({ userId }) => {

  // 2. O Coração (Estado/Dados): Usando um Custom Hook para limpar o componente
  // Note como o componente não sabe "como" os dados chegam, apenas "o que" eles são.
  const { user, status, actions } = useUserProfile(userId);

  // 3. Early Returns (Guarda): Mantém o fluxo principal livre de "ifs" aninhados
  if (status.isLoading) return <Spinner />;
  if (status.error) return <ErrorMessage message={status.error} />;

  // 4. A Obra (JSX): Curto, declarativo e sem lógica complexa entre as tags
  return (
    <section className="profile-card">
      <header>
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </header>

      <main>
        <button onClick={actions.toggleFollow}>
          {status.isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </main>

      <footer>
        <small>Último login: {user.lastLogin}</small>
      </footer>
    </section>
  );
};

```

```JSX
// custom hook simples
import { useState, useEffect } from 'react';

// Um hook que apenas observa se a página foi rolada
export function useHasScrolled() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return hasScrolled;
}
```

```JSX
// custom hook composto
import { useState, useCallback } from 'react';

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = () => setValues(initialValues);

  // Retornamos um objeto com propriedades bem categorizadas
  return {
    // Dados brutos
    values,
    errors,

    // Estados de UI
    status: {
      isSubmitting,
      isDirty: Object.keys(values).length > 0
    },

    // Funções de manipulação (Actions)
    handlers: {
      handleChange,
      resetForm,
      submit: async (apiCall) => {
        setIsSubmitting(true);
        await apiCall(values);
        setIsSubmitting(false);
      }
    }
  };
}
```

```JSX
// smartinput
import React, { useState, useMemo } from 'react';

const SmartInput = ({ initialRaw = "", logic }) => {
  // 1. RAW: O estado de verdade (ex: "12345678900")
  const [raw, setRaw] = useState(initialRaw);

  // 2. LOGIC & DATA: A transformação (ex: aplica máscara de CPF)
  // Usamos useMemo para que a "arte" só seja recalculada se o raw ou a lógica mudarem
  const data = useMemo(() => logic(raw), [raw, logic]);

  const handleChange = (e) => {
    // O pulo do gato: o usuário tentou mudar o 'data',
    // mas nós extraímos apenas o que interessa para o 'raw'
    const inputValue = e.target.value;

    // Aqui você pode decidir: o que o usuário digitou vira o novo RAW?
    // Exemplo: remover tudo que não é número antes de salvar no RAW
    const nextRaw = inputValue.replace(/\D/g, "");

    setRaw(nextRaw);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        value={data} // O usuário vê o dado transformado
        onChange={handleChange}
        placeholder="Digite aqui..."
      />
      <p>Valor Real (Raw): <code>{raw}</code></p>
    </div>
  );
};

// Exemplo de uso: Transformar números em formato de Moeda
const App = () => {
  const currencyLogic = (val) => {
    if (!val) return "";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val / 100);
  };

  return <SmartInput logic={currencyLogic} />;
};
```
