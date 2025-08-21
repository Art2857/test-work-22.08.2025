import { VirtualizedDataTable } from '@/components/table/VirtualizedDataTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Управление таблицей данных
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Таблица с 1,000,000 записей, поддержкой поиска, сортировки и
            множественного выбора
          </p>
        </header>

        <main>
          <VirtualizedDataTable />
        </main>
      </div>
    </div>
  );
}
