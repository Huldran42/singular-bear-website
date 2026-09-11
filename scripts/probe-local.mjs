try {
  const response = await fetch('http://localhost:3000/');
  console.log(response.status);
} catch (error) {
  console.log('DOWN', error.code ?? error.message);
}
