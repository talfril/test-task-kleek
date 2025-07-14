import { ref, watch, nextTick } from "vue";
import type { Ref } from "vue";
import type { UseApiOptions } from "../types";

export function useApi<T>(
  query: Ref<string> | { value: string },
  options: UseApiOptions<T>
) {
  const {
    endpoint,
    extractData,
    minQueryLength = 3,
    debounceTime = 300,
    timeout = 3000,
  } = options;

  const data = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const pending = ref(false);
  const error = ref<string | null>(null);
  const timeoutError = ref(false);
  const canRetry = ref(false);

  let controller: AbortController | null = null;
  let debounceTimeout: number | null = null;
  let timeoutId: number | null = null;

  function abortAll() {
    controller?.abort();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutError.value = false;
  }

  watch(
    () => query.value,
    (newQuery) => {
      abortAll();
      error.value = null;
      canRetry.value = false;
      pending.value = true;

      if (newQuery.length < minQueryLength) {
        data.value = [];
        pending.value = false;
        return;
      }

      debounceTimeout = window.setTimeout(async () => {
        controller = new AbortController();
        loading.value = true;
        data.value = [];

        timeoutId = window.setTimeout(() => {
          if (!loading.value) return;
          timeoutError.value = true;
          canRetry.value = true;
          error.value = "Сервер не отвечает. Попробуйте ещё раз.";
          controller?.abort();
          loading.value = false;
          pending.value = false;
        }, timeout);

        try {
          const url = endpoint(newQuery);
          if (!url) throw new Error("Неверный URL запроса");

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            if (response.status >= 500) {
              throw new Error(`Ошибка сервера (${response.status})`);
            } else if (response.status === 400) {
              throw new Error(`Некорректный запрос (${response.status})`);
            } else {
              throw new Error(`Ошибка ${response.status}`);
            }
          }

          const result = await response.json();
          const items = extractData(result);

          if (!Array.isArray(items)) {
            throw new Error("Неверный формат данных");
          }

          data.value = items;
          timeoutError.value = false;
        } catch (err: any) {
          if (err.name !== "AbortError") {
            error.value = err.message || "Неизвестная ошибка";
            data.value = [];
            canRetry.value = timeoutError.value;
          }
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          loading.value = false;
          pending.value = false;
        }
      }, debounceTime);
    }
  );

  function retry() {
    if (query.value.length >= minQueryLength && canRetry.value) {
      error.value = null;
      timeoutError.value = false;
      const current = query.value;
      query.value = "";
      nextTick(() => {
        query.value = current;
      });
    }
  }

  return {
    data,
    loading,
    pending,
    error,
    timeoutError,
    canRetry,
    retry,
  };
}
