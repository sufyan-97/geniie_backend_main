'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('system_apps', [
      {
        id: 1,
        name: 'asaap',
        packageName: 'com.example.whistletech',
        image: '',
        slug: 'asaap',
        fireBaseToken: JSON.stringify({
          "type": "service_account",
          "project_id": "asaap-330915",
          "private_key_id": "31012c93a2676134bd2be23581934da467eda7fe",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKcmEzbW+4vv8o\ntxRYBGM9lK8Lj/SPwBq/m39SEKxkRew7K2KQgnD16ksdy3WX+HonB6DMcKoEfJic\nLQXSN8RUlG9rb8Zx3TY/iI5vyeAl8x+gmOyHNmyJ3zLu5E6vTLSRYEuidFVS7XNV\nITNCUn2KwSWa1TpifJIE7AdKdrbdNXoOpl6irF4JnoR8Y8QMIUckJrJdlsVl4H/n\nDYRN4S7Lzstw8bZuJTXJ2Xsd+hw71Nn950Lt15VxMdslfK1AyB9HJJubVowpB7lY\nnhW1c4WehuSFljLXOBbiERpDIgFPF431ZXISKwpQ26tcRCvVkAi4yFjXF8dnbR22\nAYtD95uLAgMBAAECggEAB8QsZiNgw/gHyP8St7iLXqfV+h4A71/2Qijr9Z60subt\ng8gnAtYyyAe/pj7ReVbd7DSG2joR8oHUkFylzPMmcbMPfgjqH46xXVtyLIyLVKTM\nCoZzUi0n4smQgaTDGtkPwEWvAR0nYV94BsS8SWMyvXKp/oFQb+6AUK1znQIdJ8U9\nhGWRDwzlneRXRJ/ACrR2E1GYFCNeL4VFim8BvbGJun2qEwVo86lMZ0oCvrkXewu7\n6Bxi1KZElMG1lck1G/RfpQ3Kkm9p/vwYf2wESj7h6L8/3S5J4Ib/zwvW8mjsN030\nhOf5Q2bPn16O2WvEEg/auKZ5uvDa7qWhnpPiwegcuQKBgQDpb0lPCHCvG4mK0BI9\nHqXp7epRV+djn4t8n/d7BBBDy92FyRBwyhEJvipu8aiC/fZz0mfDXpcMcjIPe0k2\nsQ1a2gLpWLx7pUGCqc9Sj+wcr/stNz03dPx4md+0u3ZLEHKamTppviQdkA5R8kq6\nZXL+knqIUjSbK+zCqeUwb/skrwKBgQDeBD98URWbH/rgpH2fLHH14ggwqyWu1nYD\nFulGLjU606rPf9BXyZUtKf/r4N6IBPiO4t4kcCRhEGVlSAUsSUMItOb3qp+qIGJ+\nTLadnpvysZhhvqEcb+PP0m7XPe8zesaZfiCKvbZ3hVVGy/9QO1Um9UNRJzGAvSN+\ngSC2scWl5QKBgQChkufZDmyAp7zSGiclqvsIKidP2lpMuHfh8Q9pVGy1oHxaR8tb\nZmHYronMdPRAhux5Sp+LuQMwGDLSSHFqq64kvlXZkhQUOVRYzpSz/u5dBOoEaAG1\nSwIdr9QJ0t+UIXRR0dF+s59n3vgqfFyBHAs2bcjmZpAG/6ZHLzV2C2x3/QKBgF0G\nYqNwRiFNcQ0XXxuGv+lK4CukSpHLgn8g5nVlfyA6+GMhJubhrAPUiUsIWbWcf5k/\nLd0Or++LszCQ0LoRqGjJg81aTLQ4BYzuD8ZTYvx5tWOfQFpt94JopdDCPqvPUc+W\nrYP0obPKxkR3zW6Mrc05Dw+94FwU4/5plI94RVyRAoGATyELAnuCeJtV0tZ5OuZH\nwq57etmRh0VT4qOPrHcdDOAJDieAAUTKe2038z4NOQEK3TnTx4jF/CqSzkLwUmLp\n/kRNNPfk8ohldQJWjYz4vFl5zWK5WqxtOewACbfZz59y0yCHPao8ZUy+WVjQLYvz\nESXAFXDaxBjzIZgazGzOJ5k=\n-----END PRIVATE KEY-----\n",
          "client_email": "firebase-adminsdk-b2tds@asaap-330915.iam.gserviceaccount.com",
          "client_id": "108782410508051966104",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b2tds%40asaap-330915.iam.gserviceaccount.com"
        })
      },
      {
        id: 2,
        name: 'Asaap Restaurant',
        packageName: 'com.example.asap-restaurant',
        image: '',
        slug: 'asaap-restaurant',
        fireBaseToken: JSON.stringify({
          "type": "service_account",
          "project_id": "asap-restaurant",
          "private_key_id": "29d6205b8cb919dcced1a2cc2aa2a75a52153c96",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWAI8Op+HyTqZO\nLVZInMm2mNYiKdABowcOBE/5qTvzMsafm1Svwnxgf0QGw0qnVsF3XLbeznaWUrYY\ne7N/SZTZ5JVgp+/GxsDSnRVcHGxPRJ8GHfMn37UqAPIg0IrMusa4SQHs7dv0SNZX\nkslXY66D+WlHkW3MFYB47cctVsq4lqPtT/xwm3JXmdKHnzlZuyiCYnfTio5jpnLS\n6HPicrMVxS7ONbWFDbqBFq+HjE9a8ugeOZwRdiv2wVcaqtSQNgI3osmD5AJ42nsk\nK1yvG4ABiyY746d1I2xr3oE1lnXOnHqP6dLJC9Gyu1SPWA2orIi55FJdLY1Cl2mT\nSxgIixgrAgMBAAECggEAK1bsofq1AyYTfySmY0lBfrXgNAYExrgWDywnaDfyWLPx\nTtSd54R7PO25QKdfYJlsz/gaXvAwSwxQLZArz3z+5MvqxqrsH/UTivPeJgvpkXoj\nvJDnNC2Vmn6birLBUWoIIb1DYxDe6U+w/QZQuV6KMtcZj7Fvq5O1M4hwPInlv1D/\nog1mIZ3jnpjYShD/QXfC8KJ0Ss5Qvpg9iBUNdMcuyPjrhYMqSU8B2NFz4R9jQppo\nd6Q5DDAV29tzdy7jSK9jQ4Od22yWOpLRW1G2i/Cw3Imjk5ijsYrRyPoRh7mqadnn\nR7OgbYbfn2ZPtzwNDtvWewKUb1lmgU+aqefxyIvSYQKBgQD9be+JGl1E8szKyoB9\nOlTdG8BQlT6diqmtxgdEzLtmqpUGH3zPi+10mO9ePe/lOmeXvFWMZlWICaQUjHKw\nZZJFeMf7H3l6TqkCtMpKET+2mNbgFdBo5zBnoYU1WJ/nxcn+YbaLw4TwmBk/Wnb2\nnqXdoiwtn1DvZUKR7Hl4R+7E4QKBgQDYLD6u77782JtTxhVdQ9McDQX9SXPiolNS\ne6YkgjVVsXg6iOx/Y/JuoI91k5NIsQl5tzKx2nUrSmAdmN59xH8mIJ5F96ltV31+\n1gdRj2DZTrue2/7VAc1riqI72TK7D92o8iYe2fMQFZcxSfwd0hVNJ0Onmjr583jQ\no+d+M3pyiwKBgHmR2Qw912wRxOeqyIRKDRecDl8ZmNXeBJNVoXsBcwxG3AH57Ndq\n2lfKXVkqAQBHShZhw+/7zx/Y8BrjXMj9kHM/Az+V06I2RaEEtN1e9N9U5g7MqBMK\nhA/STaJPhzWZjdI3cWgOPKFldQcNEHAxnoN5HhQsjpioTIzPkV1/tCxBAoGADj/c\nYeuryz77/imwftVZtR+mpWuSF/5bP7Sm3wE2Qs/P/QvJixwrft9WlYmEy+XfmgZZ\ncR/VWWUtsMXC5MdvGjRMOpB4upxpyVKSaO3qlGh8NZyKz7+uqsgYqZlHns0M73YG\nzUHQo97IeJdH5y9R+CP+ca3Y9WD3NcmYGNmL2MECgYEA/K5Hk3mjpOK524QOlWMq\nfAhaQ73xsY/kXBPSMeGmMOT8+aP3SeLWULfACafY7+k6ZJtOTORPh9LShTXmmhi2\naS64OM8ORTJeNq1NmPBAR1nW3OZmSya1hZH6U1KHuMZs7Y4vjOn2jw65byKxwMyZ\nzLvpJ8y0UiKNAX8J0tnponk=\n-----END PRIVATE KEY-----\n",
          "client_email": "firebase-adminsdk-9ajdy@asap-restaurant.iam.gserviceaccount.com",
          "client_id": "113726543371614825375",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9ajdy%40asap-restaurant.iam.gserviceaccount.com"
        })
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
