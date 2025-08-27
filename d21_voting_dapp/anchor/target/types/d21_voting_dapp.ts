/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/d21_voting_dapp.json`.
 */
export type D21VotingDapp = {
  "address": "JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H",
  "metadata": {
    "name": "d21VotingDapp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "calculateResult",
      "discriminator": [
        123,
        233,
        156,
        12,
        114,
        212,
        241,
        66
      ],
      "accounts": [
        {
          "name": "anyone",
          "writable": true,
          "signer": true
        },
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "u64"
        }
      ],
      "returns": {
        "defined": {
          "name": "candidate"
        }
      }
    },
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "signer": true
        },
        {
          "name": "election",
          "writable": true
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "election"
              },
              {
                "kind": "account",
                "path": "candidate"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "candidateName",
          "type": "string"
        },
        {
          "name": "electionId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeElection",
      "discriminator": [
        59,
        166,
        191,
        126,
        195,
        0,
        153,
        168
      ],
      "accounts": [
        {
          "name": "electionOrganizer",
          "writable": true,
          "signer": true
        },
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "u64"
        },
        {
          "name": "electionName",
          "type": "string"
        },
        {
          "name": "electionDescription",
          "type": "string"
        },
        {
          "name": "electionFee",
          "type": "u64"
        },
        {
          "name": "electionOrganizer",
          "type": "pubkey"
        },
        {
          "name": "startDate",
          "type": "i64"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializeVoter",
      "discriminator": [
        105,
        39,
        201,
        10,
        15,
        118,
        10,
        107
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              }
            ]
          }
        },
        {
          "name": "voterAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "account",
                "path": "election"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "u64"
        },
        {
          "name": "voterName",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "voterAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "account",
                "path": "election"
              }
            ]
          }
        },
        {
          "name": "election"
        },
        {
          "name": "candidateAccount",
          "writable": true
        },
        {
          "name": "candidate",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "election"
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "arg",
                "path": "candidate"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "candidate",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidate",
      "discriminator": [
        86,
        69,
        250,
        96,
        193,
        10,
        222,
        123
      ]
    },
    {
      "name": "election",
      "discriminator": [
        68,
        191,
        164,
        85,
        35,
        105,
        152,
        202
      ]
    },
    {
      "name": "voter",
      "discriminator": [
        241,
        93,
        35,
        191,
        254,
        147,
        17,
        202
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Name should be less than 20"
    },
    {
      "code": 6001,
      "name": "desciptionTooLong",
      "msg": "Desciption should be less than 20"
    },
    {
      "code": 6002,
      "name": "startDateInThePast",
      "msg": "Start Date should be in future"
    },
    {
      "code": 6003,
      "name": "endDateAfterStart",
      "msg": "End Date after Start Date"
    },
    {
      "code": 6004,
      "name": "votingAfterEndDate",
      "msg": "End Date crossed"
    },
    {
      "code": 6005,
      "name": "registrationAfterEndDate",
      "msg": "Can't register after end date"
    },
    {
      "code": 6006,
      "name": "noCandidatesForResult",
      "msg": "0 candidates in election"
    }
  ],
  "types": [
    {
      "name": "candidate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "election",
            "type": "pubkey"
          },
          {
            "name": "candidate",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "voteCount",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "election",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "electionId",
            "type": "u64"
          },
          {
            "name": "electionName",
            "type": "string"
          },
          {
            "name": "electionDescription",
            "type": "string"
          },
          {
            "name": "electionFee",
            "type": "u64"
          },
          {
            "name": "electionOrganizer",
            "type": "pubkey"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "candidateList",
            "type": {
              "vec": {
                "defined": {
                  "name": "candidate"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "voter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "election",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "votesGiven",
            "type": "i64"
          },
          {
            "name": "negativeVotesGiven",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
