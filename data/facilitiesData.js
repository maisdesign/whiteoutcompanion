const facilityData = [
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 50.08,
    "y": 12.45
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 33.91,
    "y": 28.37
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 14.07,
    "y": 50.87
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 29.08,
    "y": 65.31
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 49.97,
    "y": 86.56
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 65.98,
    "y": 70.57
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 87.19,
    "y": 49.62
  },
  {
    "Type": "Construction",
    "Level": "Lv.1",
    "x": 70.08,
    "y": 32.51
  },
  {
    "Type": "Construction",
    "Level": "Lv.3",
    "x": 36.38,
    "y": 57.69
  },
  {
    "Type": "Construction",
    "Level": "Lv.3",
    "x": 56.12,
    "y": 64.87
  },
  {
    "Type": "Construction",
    "Level": "Lv.3",
    "x": 61.84,
    "y": 40.36
  },
  {
    "Type": "Construction",
    "Level": "Lv.3",
    "x": 46.04,
    "y": 32.44
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 45.56,
    "y": 17.11
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 21.68,
    "y": 43.17
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 17.38,
    "y": 53.91
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 42.52,
    "y": 78.79
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 53.96,
    "y": 82.56
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 74.96,
    "y": 61.46
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 83.25,
    "y": 45.62
  },
  {
    "Type": "Production",
    "Level": "Lv.1",
    "x": 62.83,
    "y": 25.26
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 28.87,
    "y": 57.61
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 34.12,
    "y": 70.57
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 56.9,
    "y": 69.53
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 70.6,
    "y": 42.06
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 66.14,
    "y": 28.44
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 41.15,
    "y": 30.07
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 29.92,
    "y": 34.81
  },
  {
    "Type": "Defense",
    "Level": "Lv.2",
    "x": 71.08,
    "y": 65.61
  },
  {
    "Type": "Defense",
    "Level": "Lv.4",
    "x": 36.85,
    "y": 53.39
  },
  {
    "Type": "Defense",
    "Level": "Lv.4",
    "x": 60.47,
    "y": 61.02
  },
  {
    "Type": "Defense",
    "Level": "Lv.4",
    "x": 53.91,
    "y": 36.44
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 26.93,
    "y": 67.53
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 46.09,
    "y": 82.41
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 67.93,
    "y": 72.86
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 82.68,
    "y": 53.76
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 72.6,
    "y": 29.7
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 55.33,
    "y": 17.7
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 30.03,
    "y": 26.81
  },
  {
    "Type": "Gathering",
    "Level": "Lv.1",
    "x": 18.16,
    "y": 44.28
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 49.97,
    "y": 21.33
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 34.12,
    "y": 38.95
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 21.26,
    "y": 50.06
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 39.21,
    "y": 65.61
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 50.03,
    "y": 78.71
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 65.83,
    "y": 60.35
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 78.64,
    "y": 49.84
  },
  {
    "Type": "Tech",
    "Level": "Lv.1",
    "x": 65.93,
    "y": 38.73
  },
  {
    "Type": "Tech",
    "Level": "Lv.3",
    "x": 49.97,
    "y": 71.38
  },
  {
    "Type": "Tech",
    "Level": "Lv.3",
    "x": 71.55,
    "y": 49.99
  },
  {
    "Type": "Tech",
    "Level": "Lv.3",
    "x": 50.03,
    "y": 28.44
  },
  {
    "Type": "Tech",
    "Level": "Lv.3",
    "x": 28.5,
    "y": 49.99
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 38.01,
    "y": 74.57
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 59.06,
    "y": 77.53
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 79.11,
    "y": 57.61
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 79.53,
    "y": 41.92
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 58.01,
    "y": 20.67
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 42.1,
    "y": 20.37
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 24.93,
    "y": 37.62
  },
  {
    "Type": "Weapons",
    "Level": "Lv.2",
    "x": 20.84,
    "y": 57.61
  },
  {
    "Type": "Weapons",
    "Level": "Lv.4",
    "x": 45.98,
    "y": 62.87
  },
  {
    "Type": "Weapons",
    "Level": "Lv.4",
    "x": 63.52,
    "y": 45.4
  },
  {
    "Type": "Weapons",
    "Level": "Lv.4",
    "x": 39.0,
    "y": 39.55
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 25.77,
    "y": 62.28
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 40.21,
    "y": 68.64
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 63.99,
    "y": 72.79
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 71.13,
    "y": 57.46
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 73.28,
    "y": 35.92
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 58.37,
    "y": 29.77
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 31.18,
    "y": 40.21
  },
  {
    "Type": "Training",
    "Level": "Lv.2",
    "x": 39.27,
    "y": 25.63
  },
  {
    "Type": "Expedition",
    "Level": "Lv.3",
    "x": 34.86,
    "y": 43.54
  },
  {
    "Type": "Expedition",
    "Level": "Lv.3",
    "x": 57.9,
    "y": 36.36
  },
  {
    "Type": "Expedition",
    "Level": "Lv.3",
    "x": 67.66,
    "y": 53.84
  },
  {
    "Type": "Expedition",
    "Level": "Lv.3",
    "x": 40.47,
    "y": 61.91
  },
  {
    "Type": "Stronghold",
    "Level": "Lv.1",
    "x": 41.78,
    "y": 41.77
  },
  {
    "Type": "Stronghold",
    "Level": "Lv.2",
    "x": 42.05,
    "y": 57.61
  },
  {
    "Type": "Stronghold",
    "Level": "Lv.3",
    "x": 57.74,
    "y": 57.39
  },
  {
    "Type": "Stronghold",
    "Level": "Lv.4",
    "x": 57.95,
    "y": 41.77
  },
  {
    "Type": "Fortress",
    "Level": "Lv.1",
    "x": 26.35,
    "y": 54.95
  },
  {
    "Type": "Fortress",
    "Level": "Lv.2",
    "x": 35.17,
    "y": 63.68
  },
  {
    "Type": "Fortress",
    "Level": "Lv.3",
    "x": 45.62,
    "y": 73.9
  },
  {
    "Type": "Fortress",
    "Level": "Lv.4",
    "x": 55.22,
    "y": 73.38
  },
  {
    "Type": "Fortress",
    "Level": "Lv.5",
    "x": 63.94,
    "y": 64.72
  },
  {
    "Type": "Fortress",
    "Level": "Lv.6",
    "x": 74.23,
    "y": 54.28
  },
  {
    "Type": "Fortress",
    "Level": "Lv.7",
    "x": 74.23,
    "y": 45.4
  },
  {
    "Type": "Fortress",
    "Level": "Lv.8",
    "x": 63.99,
    "y": 35.1
  },
  {
    "Type": "Fortress",
    "Level": "Lv.9",
    "x": 55.07,
    "y": 26.15
  },
  {
    "Type": "Fortress",
    "Level": "Lv.10",
    "x": 45.46,
    "y": 25.48
  },
  {
    "Type": "Fortress",
    "Level": "Lv.11",
    "x": 35.85,
    "y": 34.96
  },
  {
    "Type": "Fortress",
    "Level": "Lv.12",
    "x": 26.35,
    "y": 44.65
  }
];
