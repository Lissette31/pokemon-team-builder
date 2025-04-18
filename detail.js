import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://byksolxmcpciwzthpsre.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a3NvbHhtY3BjaXd6dGhwc3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDc3NDAsImV4cCI6MjA2MDQyMzc0MH0.7Eip2yz8Y7C6VLxmHJ_QUKqesj0w2sFoCOhold2J4fQ'
);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// HTML elements
const nameEl = document.getElementById('pokemon-name');
const levelEl = document.getElementById('pokemon-level');
const typeEl = document.getElementById('pokemon-type');
const imgEl = document.getElementById('pokemon-img');
const editLink = document.getElementById('edit-link');

async function loadPokemon() {
  const { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading Pokémon:', error);
    return;
  }

  nameEl.textContent = data.name;
  levelEl.textContent = data.level;
  typeEl.textContent = data.type;
  imgEl.src = `https://img.pokemondb.net/artwork/${data.name.toLowerCase()}.jpg`;
  editLink.href = `edit.html?id=${data.id}`;
}

loadPokemon();
