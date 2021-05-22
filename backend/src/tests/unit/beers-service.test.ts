import BeersService from "../../services/beers-service";


let beersService: BeersService;
const numPeople = 15;

beforeEach(() => {
  beersService = new BeersService();
})

describe("BeerService", () => {
  it('If temp < 20°C each person consumes 0.75 beers', () => {
    const temp = 19.9;
    const beersPerPerson = 0.75;

    const numBeers = numPeople * beersPerPerson;
    const numPacks = Math.ceil(numBeers/6);

    const calculatedNumPacks = beersService.getNumBeerPacks(temp, numPeople);

    expect(numPacks).toEqual(calculatedNumPacks);
  })

  it('If 20°C =< temp <= 24°C each person consumes 1 beer', () => {
    const temp = 20;
    const beersPerPerson = 1;
    
    const numBeers = numPeople * beersPerPerson;
    const numPacks = Math.ceil(numBeers/6);

    const calculatedNumPacks = beersService.getNumBeerPacks(temp, numPeople);

    expect(numPacks).toEqual(calculatedNumPacks);
  })

  it('If temp > 24°C each person consumes 2 beers', () => {
    const temp = 24.1;
    const beersPerPerson = 2;
    
    const numBeers = numPeople * beersPerPerson;
    const numPacks = Math.ceil(numBeers/6);

    const calculatedNumPacks = beersService.getNumBeerPacks(temp, numPeople);

    expect(numPacks).toEqual(calculatedNumPacks);
  })
})