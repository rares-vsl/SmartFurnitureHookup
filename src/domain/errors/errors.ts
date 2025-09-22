export class SFHNameConflictError extends Error {
  constructor(name: string) {
    super(`Name ${name} already exists`);
    this.name = "SFHNameConflictError";
  }
}

export class SFHEndpointConflictError extends Error {
  constructor(endpoint: string) {
    super(`Endpoint ${endpoint} already exists`);
    this.name = "SFHEndpointConflictError";
  }
}

export class SmartFurnitureHookupNotFoundError extends Error {
  constructor() {
    super("Smart furniture hookup not found");
    this.name = "SFHNotFoundError";
  }
}

export class InvalidIDError extends Error {
  constructor() {
    super("Invalid smart furniture hookup ID format");
    this.name = "InvalidIDError";
  }
}

export class InvalidConsumptionTypeError extends Error {
  constructor(type: string) {
    super(`Invalid consumption type: ${type}`);
    this.name = "InvalidConsumptionTypeError";
  }
}

export class InvalidConsumptionUnitError extends Error {
  constructor(unit: string) {
    super(`Invalid consumption unit: ${unit}`);
    this.name = "InvalidConsumptionUnitError";
  }
}
