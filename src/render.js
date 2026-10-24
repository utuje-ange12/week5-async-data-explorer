import { escapeHTML, getProvinces, getStats, getVisibleItems } from "./utils.js"

const app = document.querySelector("#app")
const statusEl = document.querySelector("#status")
const statsEl = document.querySelector("#stats")
const filterEl = document.querySelector("#filter")
const dialog = document.querySelector("#details")
const dialogBody = document.querySelector("#details-body")

const skeletonCard = () => `
  <div class="animate-pulse rounded-xl bg-white p-4 shadow">
    <div class="h-5 w-1/2 rounded bg-slate-200"></div>
    <div class="mt-3 h-4 w-3/4 rounded bg-slate-200"></div>
    <div class="mt-2 h-4 w-2/3 rounded bg-slate-200"></div>
  </div>`

const card = ({ name, province, days }) => {
    const { max, min, rain } = days?.[0] ?? {}
    return `
    <button type="button" data-city="${escapeHTML(name)}"
      class="rounded-xl bg-white p-4 text-left shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
      <h2 class="text-lg font-semibold">${escapeHTML(name)}</h2>
      <p class="text-sm text-slate-500">${escapeHTML(province)}</p>
      <p class="mt-3 text-2xl font-bold text-emerald-600">${escapeHTML(max ?? "--")}°C</p>
      <p class="text-sm text-slate-600">Low ${escapeHTML(min ?? "--")}°C</p>
      <p class="text-sm text-slate-600">Rain ${escapeHTML(rain ?? 0)} mm</p>
    </button>`
}

const statCard = (label, value) => `
  <div class="rounded-xl bg-white p-4 shadow">
    <p class="text-sm text-slate-500">${label}</p>
    <p class="text-2xl font-bold">${escapeHTML(value)}</p>
  </div>`

const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    })

const dayRow = ({ date, max, min, rain }) => `
  <tr class="border-t border-slate-200">
    <td class="py-2 pr-2">${escapeHTML(formatDate(date))}</td>
    <td class="py-2 pr-2 font-medium text-emerald-700">${escapeHTML(max ?? "--")}°C</td>
    <td class="py-2 pr-2">${escapeHTML(min ?? "--")}°C</td>
    <td class="py-2">${escapeHTML(rain ?? 0)} mm</td>
  </tr>`

function renderDetails({ detail }) {
    if (detail.status === "idle") {
        if (dialog.open) dialog.close()
        return
    }

    const { city, status, days, error } = detail
    let content = ""

    if (status === "loading") {
        content = `
      <div class="animate-pulse space-y-3">
        <div class="h-4 w-full rounded bg-slate-200"></div>
        <div class="h-4 w-5/6 rounded bg-slate-200"></div>
        <div class="h-4 w-2/3 rounded bg-slate-200"></div>
      </div>`
    } else if (status === "error") {
        content = `<p class="rounded bg-red-50 p-4 text-red-700">Could not load the forecast. (${escapeHTML(error)})</p>`
    } else {
        content = `
      <table class="w-full text-left text-sm">
        <thead class="text-slate-500">
          <tr><th class="pb-2 font-medium">Day</th><th class="pb-2 font-medium">High</th><th class="pb-2 font-medium">Low</th><th class="pb-2 font-medium">Rain</th></tr>
        </thead>
        <tbody>${days.map(dayRow).join("")}</tbody>
      </table>`
    }

    dialogBody.innerHTML = `
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 id="details-title" class="text-xl font-bold">${escapeHTML(city.name)}</h2>
        <p class="text-sm text-slate-500">${escapeHTML(city.province)} province, 7-day forecast</p>
      </div>
      <button type="button" data-action="close-details" aria-label="Close details"
        class="rounded bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200">Close</button>
    </div>
    ${content}`

    if (!dialog.open) dialog.showModal()
}

function renderFilterOptions(state) {
    const options = getProvinces(state.items)
        .map((p) => `<option value="${escapeHTML(p)}">${escapeHTML(p)}</option>`)
        .join("")
    filterEl.innerHTML = `<option value="all">All provinces</option>${options}`
    filterEl.value = state.filter
}

export function render(state) {
    renderDetails(state)

    if (state.status === "loading") {
        statsEl.innerHTML = ""
        statusEl.textContent = "Loading forecasts..."
        app.innerHTML = `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${Array.from({ length: 8 }, skeletonCard).join("")}</div>`
        return
    }

    if (state.status === "error") {
        statsEl.innerHTML = ""
        statusEl.textContent = "Something went wrong."
        app.innerHTML = `
      <div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p class="font-medium text-red-700">We could not load the weather. (${escapeHTML(state.error)})</p>
        <button data-action="retry" class="mt-4 rounded bg-red-600 px-4 py-2 text-white">Retry</button>
      </div>`
        return
    }

    renderFilterOptions(state)
    const visible = getVisibleItems(state)
    const { count, avgMax, totalRain } = getStats(visible)

    statsEl.innerHTML = [
        statCard("Cities shown", count),
        statCard("Average high today", avgMax === null ? "--" : `${avgMax.toFixed(1)}°C`),
        statCard("Total rain today", `${totalRain.toFixed(1)} mm`),
    ].join("")

    if (visible.length === 0) {
        statusEl.textContent = "No cities match your search or filter."
        app.innerHTML = `<p class="rounded-xl bg-white p-6 text-center text-slate-600">No cities found. Try a different search or filter.</p>`
        return
    }

    const failedNote = state.failed.length ? ` (${state.failed.join(", ")} could not load)` : ""
    statusEl.textContent = `Showing ${visible.length} of ${state.items.length} cities${failedNote}`
    app.innerHTML = `<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">${visible.map(card).join("")}</div>`
}