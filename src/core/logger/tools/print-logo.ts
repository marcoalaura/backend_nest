/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common'
import { COLOR } from '../constants'
import { LoggerService } from '../logger.service'

const logger = LoggerService.getInstance('logger')

export async function printLogo(app: INestApplication) {
  logger.trace('')

  const logo = `
                                 $@@.
                                  $@@@  @@,
                                   ]@@"g@@@@g
                                   @,@@@@@@@@@
                ,ggg&@@@@@@BNggg,  P@@@@@@@@@@@
            ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@K
          g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   ,
       ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    @@g
 ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"   g@@@@
$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   g@@@@@@@p
]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@PP'  ,g@@@@@@@@@@@p
  ]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@p
    MB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     * @"          "PB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                       "N@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                          %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            $@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                             %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
               ,ggg           $@@@@@B@@@@@@@@@@@@@@@@@@@@@@P
              @@@@@        g@Np@@@@@ @@@@@@@@@@@@@@@@@R@@@@
              @@@@@@    @g@@@@@@@@@  @@@@@@@@@@@@@@@@@ @@@
              ]@@@@@@@@@@@@@@@@@@P  ]@@@@@@@@@@@@@@@@P $@
               "B@@@@@@@@@@@@@@P   ,@@@@@@@@@@@@@@@@P  P
               "PB@@@@@@@@BPP     g@@@@@@@@@@@P]@@@P
                                ,@@@@B@@@@@@P  @@P
                               ""  ,g@@@@@P  ,@P'
     NestJS Base Backend         ,@@@@@P-   7P
                              ,@@@P-
  `

  const toPrint = logo.replace(/\n/g, `\n${COLOR.LIGHT_GREY}`)
  process.stdout.write(`${COLOR.LIGHT_GREY}${toPrint}${COLOR.RESET}\n`)
}
