import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';

interface Resultado<T> {
  clave: string | number;
  intento: number;
  data: T | null;
  error: string | null;
}

export function useRecurso<T>(cargar: () => Promise<T>, clave: string | number) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  useEffect(() => {
    let activo = true;

    cargar()
      .then((data) => {
        if (activo) {
          setResultado({ clave, intento, data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (activo) {
          setResultado({ clave, intento, data: null, error: getErrorMessage(error) });
        }
      });

    return () => {
      activo = false;
    };
  }, [cargar, clave, intento]);

  const vigente =
    resultado !== null && resultado.clave === clave && resultado.intento === intento
      ? resultado
      : null;

  const recargar = useCallback(() => {
    setIntento((valor) => valor + 1);
  }, []);

  return {
    data: vigente?.data ?? null,
    cargando: vigente === null,
    error: vigente?.error ?? null,
    recargar,
  };
}
