
  let HITSTER_GERMANY;
  let HITSTER_GERMANY_ROCK;
  let HITSTER_GERMANY_GUILTY_PLEASURE;
  let HITSTER_GERMANY_CHRISTMAS;
  async function hitsterLoadData() {
      let res = await fetch('./hitster_germany.json');
      HITSTER_GERMANY = await res.json();
      res = await fetch('./hitster_germany_rock.json');
      HITSTER_GERMANY_ROCK = await res.json();
      res = await fetch('./hitster_germany_christmas.json');
      HITSTER_GERMANY_CHRISTMAS = await res.json();
      res = await fetch('./hitster_germany_guilty_pleasure.json');
      HITSTER_GERMANY_GUILTY_PLEASURE = await res.json();
  }

hitsterLoadData();
