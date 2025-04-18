import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://byksolxmcpciwzthpsre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a3NvbHhtY3BjaXd6dGhwc3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDc3NDAsImV4cCI6MjA2MDQyMzc0MH0.7Eip2yz8Y7C6VLxmHJ_QUKqesj0w2sFoCOhold2J4fQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const pokemonId = params.get('id');

const form = document.getElementById('edit-form');
const nameInput = document.getElementById('edit-name');
const levelInput = document.getElementById('edit-level');
const typesContainer = document.getElementById('edit-types');
const deleteBtn = document.getElementById('delete-btn');

// Create radio options dynamically
const types = ['Electric', 'Fire', 'Water', 'Grass', 'Psychic', 'Fighting', 'Ice', 'Dragon', 'Dark'];
typesContainer.innerHTML = types.map(type => `
  <label><input type="radio" name="type" value="${type}" required /> ${type}</label>
`).join('');

// Load Pokémon info and fill form
async function loadPokemon() {
  const { data, error } = await supabase
    .from('pokemon')
    .select('*')
    .eq('id', pokemonId)
    .single();

  if (error) {
    console.error('Failed to load Pokémon:', error);
    return;
  }

  nameInput.value = data.name;
  levelInput.value = data.level;

  const typeRadio = document.querySelector(`input[name="type"][value="${data.type}"]`);
  if (typeRadio) typeRadio.checked = true;
}

loadPokemon();


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const level = parseInt(levelInput.value);
  const type = document.querySelector('input[name="type"]:checked')?.value;

  const { error } = await supabase
    .from('pokemon')
    .update({ name, level, type })
    .eq('id', pokemonId);

  if (error) {
    console.error('Update error:', error);
    alert('Error updating Pokémon');
  } else {
    alert('Pokémon updated successfully!');
    window.location.href = 'gallery.html'; 
  }
});

// Handle delete button
if (deleteBtn) {
  deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const confirmDelete = confirm('Are you sure you want to delete this Pokémon?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('pokemon')
      .delete()
      .eq('id', pokemonId);

    if (error) {
      console.error('Supabase Delete Error:', error);
      alert('Failed to delete Pokémon.');
    } else {
      alert('Pokémon deleted!');
      window.location.href = 'gallery.html';
    }
  });
}
