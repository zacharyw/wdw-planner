function getParkIcon(park) {
  if (park === 'Magic Kingdom') {
    return 'chess-rook';
  } else if (park === 'Epcot') {
    return 'globe';
  } else if (park === 'Animal Kingdom') {
    return 'hippo';
  } else if (park === 'Hollywood Studios') {
    return 'film';
  }

  return 'map-pin';
}

export default getParkIcon;
