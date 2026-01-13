/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Exporta datos a CSV
 * @param {Array} data - Array de objetos a exportar
 * @param {string} filename - Nombre del archivo
 */
export function exportToCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar')
  }

  // Obtener las claves del primer objeto como encabezados
  const headers = Object.keys(data[0])
  
  // Crear fila de encabezados
  const csvHeaders = headers.map(header => `"${header}"`).join(',')
  
  // Crear filas de datos
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Manejar valores nulos, undefined y objetos
      if (value === null || value === undefined) return '""'
      if (typeof value === 'object') return `"${JSON.stringify(value)}"`
      // Escapar comillas dobles
      return `"${String(value).replace(/"/g, '""')}"`
    }).join(',')
  })
  
  // Combinar todo
  const csvContent = [csvHeaders, ...csvRows].join('\n')
  
  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exporta datos a JSON
 * @param {Array} data - Array de objetos a exportar
 * @param {string} filename - Nombre del archivo
 */
export function exportToJSON(data, filename = 'export') {
  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar')
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exporta todos los datos de la aplicación
 * @param {Object} allData - Objeto con todos los datos
 */
export function exportAllData(allData) {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: {
      players: allData.players || [],
      tournaments: allData.tournaments || [],
      matches: allData.matches || [],
      payments: allData.payments || [],
      paymentRecords: allData.paymentRecords || []
    }
  }
  
  exportToJSON(exportData, 'truco_tournament_backup')
}

/**
 * Importa datos desde JSON
 * @param {File} file - Archivo JSON a importar
 * @returns {Promise<Object>} - Datos importados
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('Error al parsear el archivo JSON'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsText(file)
  })
}

