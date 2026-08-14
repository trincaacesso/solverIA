"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carrega dados do banco cuidando de três coisas que toda tela precisa:
 * mostrar "carregando", mostrar o erro quando a rede falha, e recarregar
 * depois de salvar algo.
 *
 * Antes disso, nenhuma tela do app sabia esperar — todas nasciam com os
 * dados já na mão, porque eram listas fixas no código.
 *
 * Uso:
 *   const { dados, carregando, erro, recarregar } = useDados(
 *     () => alunos.listar(),
 *     [],            // recarrega quando algo aqui muda
 *   );
 */
export function useDados<T>(
  buscar: () => Promise<T>,
  dependencias: unknown[] = [],
) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Guarda a função numa referência para que a tela não precise
  // memorizar com useCallback — passar uma arrow function direto no
  // parâmetro é o uso natural, e sem isso ela recarregaria a cada render.
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  // Cada carregamento ganha um número. Se dois se cruzarem (o usuário
  // trocou de semana rápido), só o mais recente escreve na tela —
  // senão o resultado antigo chega depois e sobrescreve o novo.
  const vez = useRef(0);

  const recarregar = useCallback(async () => {
    const minhaVez = ++vez.current;
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await buscarRef.current();
      if (minhaVez === vez.current) setDados(resultado);
    } catch (e) {
      if (minhaVez === vez.current) {
        setErro(e instanceof Error ? e.message : "Não foi possível carregar.");
      }
    } finally {
      if (minhaVez === vez.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  return { dados, carregando, erro, recarregar, setDados };
}

/**
 * Para salvar (criar, editar, apagar).
 *
 * Deixa o botão desabilitado enquanto grava e devolve o erro do banco —
 * que costuma ser uma regra de segurança recusando, e o usuário precisa
 * saber disso em vez de achar que salvou.
 */
export function useSalvar() {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = useCallback(
    async (acao: () => Promise<void>, aoTerminar?: () => void) => {
      setSalvando(true);
      setErro(null);
      try {
        await acao();
        aoTerminar?.();
        return true;
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não foi possível salvar.");
        return false;
      } finally {
        setSalvando(false);
      }
    },
    [],
  );

  return { salvar, salvando, erro, setErro };
}
