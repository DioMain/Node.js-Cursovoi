import "./../../css/CatalogGameElement.css"

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating'
import Tooltip from '@mui/material/Tooltip'

function GameElement({ game, onClick }) {

  return (
    <Stack direction={"row"} justifyContent={"space-between"} className='CatalogGameElement-container' onClick={() => onClick(game)}>

      <Stack direction={"row"} spacing={2}>
        {/* Cart image aspect 2:1 */}
        <img style={{ minWidth: `300px`, minHeight: `150px`,  maxWidth: `300px`, 
                    maxHeight: `150px`, objectFit: "cover", borderRadius: "2px" }} src={game.cartImageUrl} />
        <Stack justifyContent={"space-between"}>
          <Stack>
            <h2>
              {game.name}
            </h2>
            <div style={{ fontSize: "12px" }}>
              {game.tags}
            </div>
          </Stack>
          <div style={{ maxHeight: "100px", overflow: "hidden", whiteSpace: "balance" }}>
            {game.description}
          </div>
        </Stack>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"} style={{minWidth: "180px"}}>
        <Stack direction={"column"} justifyContent="space-between">
          <Stack spacing={1} style={{ marginRight: "5px" }}>

            <Stack direction={"row"} justifyContent={"end"}>
              {
                game.priceusd === "0" ?
                  <h4>Бесплатная</h4>
                  :
                  (
                    game.sale ?
                      <Tooltip title={game.sale.cause}>
                        <Stack direction={"row"} spacing={1}>
                          <h3>$ <span style={{ textDecorationLine: "line-through" }}>{game.priceusd}</span></h3>
                          <h5>$ {game.priceusd * (1 - game.sale.percent)}</h5>
                        </Stack>
                      </Tooltip>
                      :
                      <h3>$ {game.priceusd}</h3>
                  )
              }
            </Stack>
          </Stack>

          <Stack direction={"row"} justifyContent={"end"}>
            {
              game.middleMark === -1 ?
              <h4>Игра не имеет оценки</h4>
              :
              <Rating value={game.middleMark} precision={0.5} readOnly />
            }
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default GameElement;