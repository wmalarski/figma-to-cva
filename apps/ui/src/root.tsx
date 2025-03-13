import { type Component, ErrorBoundary, Suspense } from "solid-js";
import { ErrorFallback } from "./modules/common/components/error-fallback";
import { I18nContextProvider } from "./modules/common/contexts/i18n";
import { Main } from "./modules/main/main";

export const App: Component = () => {
  return (
    <I18nContextProvider>
      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense>
          <Main />
        </Suspense>
      </ErrorBoundary>
    </I18nContextProvider>
  );
};
