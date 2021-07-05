
class ApiPerformanceLog {
  constructor ({ sessionId, measuring, requestURI, executionTimeMilliSeconds, notes }) {
    this.sessionId = sessionId
    this.measuring = measuring
    this.requestURI = requestURI
    this.executionTimeMilliSeconds = executionTimeMilliSeconds
    this.notes = notes
  }
}

module.exports = { ApiPerformanceLog }
