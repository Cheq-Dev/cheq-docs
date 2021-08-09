var temp = {
    "swagger": "2.0",
    "info": {
        "description": "This is the list of APIs for Cheq's backend HTTP server.",
        "version": "1.0.0",
        "title": "Cheq API"
    },
    "basePath": "/api/v1",
    "tags": [
        {
            "name": "user",
            "description": "Everything about users"
        },
        {
            "name": "transaction",
            "description": "Any expense or income"
        },
        {
            "name": "category",
            "description": "Category of expense and income"
        },
        {
            "name": "account",
            "description": "Financial accounts of users"
        },
        {
            "name": "account type",
            "description": "Type of an account. E.g. Savings account"
        }
    ],
    "schemes": [
        "https"
    ],
    "paths": {
        "/users": {
            "post": {
                "tags": [
                    "user"
                ],
                "summary": "Register a new user",
                "description": "",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "User object that needs to be registered",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ID of created user",
                        "schema": {
                            "$ref": "#/definitions/ValidUserDataResponse"
                        }
                    },
                    "402": {
                        "description": "User data failed validation",
                        "schema": {
                            "$ref": "#/definitions/InvalidUserDataResponse"
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "$ref": "#/definitions/ServerErrorResponse"
                        }
                    }
                }
            }
        },
        "/users/{userId}/transactions/{transactionId}": {
            "get": {
                "tags": [
                    "transaction"
                ],
                "summary": "Get a specific transaction by ID, be it an income or expense",
                "description": "",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "userId",
                        "in": "path",
                        "description": "ID of user who creates the transaction",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "name": "transactionId",
                        "in": "path",
                        "description": "ID of transaction",
                        "required": true,
                        "type": "integer"
                    },
                ],
                "responses": {
                    "200": {
                        "description": "The specific transaction",
                        "schema": {
                            "allOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer"
                                        },
                                        "category": {
                                            "$ref": "#/definitions/Category"
                                        },
                                        "type": {
                                            "type": "string",
                                            "enum": [
                                                "expense",
                                                "income"
                                            ]
                                        }
                                    }
                                },
                                {
                                    "$ref": "#/definitions/Transaction"
                                },
                            ]
                        }
                    },
                    "400": {
                        "description": "Invalid user ID or not found transaction",
                        "schema": {
                            "$ref": "#/definitions/NotFoundResponse"
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "$ref": "#/definitions/ServerErrorResponse"
                        }
                    }
                }
            }
        },
        "/users/{userId}/transactions": {
            "post": {
                "tags": [
                    "transaction"
                ],
                "summary": "Create a new expense or income",
                "description": "",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "userId",
                        "in": "path",
                        "description": "ID of user who creates the transaction",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Transaction object that needs to be created \n Type must be 'expense' or 'income'",
                        "required": true,
                        "schema": {
                            "allOf": [
                                {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "description": "Type of transaction",
                                            "enum": [
                                                "expense",
                                                "income"
                                            ]
                                        },
                                        "categoryId": {
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "$ref": "#/definitions/Transaction"
                                }
                            ]
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ID of transaction created",
                        "schema": {
                            "$ref": "#/definitions/ValidTransactionDataResponse"
                        }
                    },
                    "402": {
                        "description": "Transaction data failed validation",
                        "schema": {
                            "$ref": "#/definitions/InvalidTransactionDataResponse"
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "$ref": "#/definitions/ServerErrorResponse"
                        }
                    }
                }
            },
            "get": {
                "tags": [
                    "transaction"
                ],
                "summary": "Get the list of expense or incomes or both",
                "description": "",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "type",
                        "in": "query",
                        "description": "The type of transactions to retrieve",
                        "type": "string",
                        "enum": [
                            "expense",
                            "income"
                        ]
                    },
                    {
                        "name": "userId",
                        "in": "path",
                        "description": "ID of user who retrieves the transactions",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of transactions",
                        "schema": {
                            "$ref": "#/definitions/GetTransactionsDataResponse"
                        }
                    },
                    "400": {
                        "description": "Invalid user ID",
                        "schema": {
                            "$ref": "#/definitions/NotFoundResponse"
                        }
                    },
                    "402": {
                        "description": "Transaction data failed validation",
                        "schema": {
                            "$ref": "#/definitions/InvalidTransactionFilterResponse"
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "$ref": "#/definitions/ServerErrorResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "User": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "ValidUserDataResponse": {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "integer"
                }
            }
        },
        "InvalidUserDataResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string"
                        },
                        "password": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "Transaction": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "number"
                },
                "note": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        },
        "ValidTransactionDataResponse": {
            "type": "object",
            "properties": {
                "transactionId": {
                    "type": "integer"
                }
            }
        },
        "InvalidTransactionDataResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "object",
                    "properties": {
                        "amount": {
                            "type": "string"
                        },
                        "note": {
                            "type": "string"
                        },
                        "created_at": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "categoryId": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "GetTransactionsDataResponse": {
            "type": "object",
            "properties": {
                "transactions": {
                    "type": "object",
                    "properties": {
                        "expenses": {
                            "type": "array",
                            "items": {
                                "allOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "type": "integer"
                                            },
                                            "category": {
                                                "$ref": "#/definitions/Category"
                                            }
                                        }
                                    },
                                    {
                                        "$ref": "#/definitions/Transaction"
                                    }
                                ]
                            }
                        },
                        "incomes": {
                            "type": "array",
                            "items": {
                                "allOf": [
                                    {
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "type": "integer"
                                            },
                                            "category": {
                                                "$ref": "#/definitions/Category"
                                            }
                                        }
                                    },
                                    {
                                        "$ref": "#/definitions/Transaction"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        "Category": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "InvalidTransactionFilterResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "example": "must be one of ['expense', 'income']"
                        },
                    }
                }
            }
        },
        "NotFoundResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string",
                    "example": "the requested resource could not be found"
                }
            }
        },
        "ServerErrorResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string",
                    "example": "the server encountered a problem and could not process your request"
                }
            }
        }
    }
}