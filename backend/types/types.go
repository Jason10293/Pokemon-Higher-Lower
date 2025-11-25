package types

type CardResponse struct {
	Data struct {
		ID     string `json:"id"`
		Name   string `json:"name"`
		Images struct {
			Small string `json:"small"`
		} `json:"images"`
		TCGPlayer struct {
			Prices struct {
				Holofoil struct {
					Mid float64 `json:"mid"`
				} `json:"holofoil"`
			} `json:"prices"`
		} `json:"tcgplayer"`
	} `json:"data"`
}

type Card struct {
	Id       int     `json:"id" db:"id"`
	Name     string  `json:"name" db:"name"`
	Price    float64 `json:"price" db:"price"`
	ImageURL string  `json:"image_url" db:"image_url"`
	SetName  string  `json:"set_name" db:"set_name"`
}
