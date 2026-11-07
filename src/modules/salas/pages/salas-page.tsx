"use client";

import React from "react";
import { useSalas } from "../hooks";
import {
  SalasHeader,
  SalasStats,
  SalasSearch,
  SalasPagination,
  RoomCard,
  DeleteRoomModal,
  SalasSkeleton,
  SalasEmptyState,
  SalasNoResults,
  SalasToast,
} from "../components";

export function SalasPage() {
  const {
    rooms,
    loading,
    error,
    search,
    setSearch,
    clearSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalRooms,
    metrics,
    metricsLoading,
    deletingRoom,
    setDeletingRoom,
    toastMessage,
    setToastMessage,
    handleRoomDeleted,
  } = useSalas();

  const isSearching = Boolean(search.trim());

  return (
    <div className="flex flex-1 flex-col bg-paper overflow-y-auto">
      {/* Toast Notification */}
      <SalasToast
        toast={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Page Header */}
      <SalasHeader />

      {/* Stats strip calculada pelo banco de dados */}
      <SalasStats metrics={metrics} loading={metricsLoading} />

      {/* Search bar integrada à API com debounce */}
      {(!metricsLoading && (metrics?.total_rooms ?? 0) > 0) && (
        <SalasSearch
          search={search}
          onSearchChange={setSearch}
          resultCount={totalRooms}
          loading={loading}
        />
      )}

      {/* Content */}
      <div className="flex-1 px-9 py-7">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-danger bg-danger-surface px-5 py-4 text-body text-ink mb-6">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <SalasSkeleton />}

        {/* Empty state (nenhuma sala no tenant) */}
        {!loading && !error && !isSearching && totalRooms === 0 && (
          <SalasEmptyState />
        )}

        {/* No search results (busca não encontrou correspondências) */}
        {!loading && !error && isSearching && rooms.length === 0 && (
          <SalasNoResults onClear={clearSearch} />
        )}

        {/* Room cards grid */}
        {!loading && !error && rooms.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDelete={(r) => setDeletingRoom(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Paginação da rota */}
      {!loading && !error && totalRooms > 0 && (
        <SalasPagination
          page={page}
          totalPages={totalPages}
          totalItems={totalRooms}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Modal de Exclusão */}
      {deletingRoom && (
        <DeleteRoomModal
          room={deletingRoom}
          onClose={() => setDeletingRoom(null)}
          onDeleted={handleRoomDeleted}
        />
      )}
    </div>
  );
}
