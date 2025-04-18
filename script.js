import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://byksolxmcpciwzthpsre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a3NvbHhtY3BjaXd6dGhwc3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDc3NDAsImV4cCI6MjA2MDQyMzc0MH0.7Eip2yz8Y7C6VLxmHJ_QUKqesj0w2sFoCOhold2J4fQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Elements
const form = document.getElementById('pokemon-form');
const nameInput = document.getElementById('name');
const levelInput = document.getElementById('level');
const teamList = document.getElementById('team-list');


function getPokemonIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
const currentId = getPokemonIdFromURL();

// CREATE
if (form && !currentId) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const level = parseInt(levelInput.value);
    const type = document.querySelector('input[name="type"]:checked')?.value;

    if (!type) return alert('Please select a Pokémon type!');

    const { error } = await supabase.from('pokemon').insert([{ name, level, type }]);

    if (error) {
      alert('Failed to add Pokémon.');
      console.error(error);
    } else {
      alert('Pokémon added successfully!');
      form.reset();
      loadPokemon(); 
    }
  });
}

//READ / LIST
async function loadPokemon() {
  const { data, error } = await supabase.from('pokemon').select('*').order('id', { ascending: false });

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  if (teamList) {
    teamList.innerHTML = '';
    data.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'pokemon-card';
      div.classList.add(`type-${p.type.toLowerCase()}`); // Type border

      div.innerHTML = `
        <a href="detail.html?id=${p.id}">
          <img class="pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokéball" />
        </a>
        <strong class="pokemon-name">${p.name}</strong><br />
        Type: ${p.type}<br />
        Level: ${p.level}<br/>
        <a href="edit.html?id=${p.id}" class="edit-btn">Edit</a>
      `;
      teamList.appendChild(div);
    });

    updateSummaryStats(data); // show stats
  }
}

// summary stats by type
function updateSummaryStats(data) {
  const summaryEl = document.getElementById('summary-stats');
  if (!summaryEl) return;

  const total = data.length;
  const typeCounts = {};

  data.forEach((p) => {
    const type = p.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  let summaryHTML = `<h3>Summary Stats</h3>`;
  for (const type in typeCounts) {
    const percent = ((typeCounts[type] / total) * 100).toFixed(1);
    summaryHTML += `<p>${type}: ${percent}%</p>`;
  }

  summaryEl.innerHTML = summaryHTML;
}

if (teamList) {
  loadPokemon();
}

// DETAIL 
const detailName = document.getElementById('pokemon-name');
const detailLevel = document.getElementById('pokemon-level');
const detailType = document.getElementById('pokemon-type');
const detailImg = document.getElementById('pokemon-img');
const battleMsg = document.getElementById('battle-message');

async function loadDetailPage() {
  if (!currentId || !detailName) return;

  const { data, error } = await supabase.from('pokemon').select('*').eq('id', currentId).single();

  if (error) {
    console.error(error);
    return;
  }

  detailName.textContent = data.name;
  detailLevel.textContent = data.level;
  detailType.textContent = data.type;
  detailImg.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

  if (battleMsg) {
    battleMsg.textContent =
      data.level > 30
        ? `Wow, ${data.name} is super strong! They'll be helpful in battle! ⚔️🔥`
        : `Train ${data.name} more to become battle ready! 💪✨`;
  }

  const editLink = document.getElementById('edit-link');
  if (editLink) editLink.href = `edit.html?id=${data.id}`;
}
loadDetailPage();

// UPDATE + DELETE 
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

async function loadEditForm() {
  if (!currentId || !form) return;

  const { data, error } = await supabase.from('pokemon').select('*').eq('id', currentId).single();

  if (error) {
    console.error(error);
    return;
  }

  nameInput.value = data.name;
  levelInput.value = data.level;
  const radio = document.querySelector(`input[name="type"][value="${data.type}"]`);
  if (radio) radio.checked = true;
}
loadEditForm();

if (saveBtn) {
  saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const updatedName = nameInput.value.trim();
    const updatedLevel = parseInt(levelInput.value);
    const updatedType = document.querySelector('input[name="type"]:checked')?.value;

    const { error } = await supabase
      .from('pokemon')
      .update({ name: updatedName, level: updatedLevel, type: updatedType })
      .eq('id', currentId);

    if (error) {
      alert('Error updating Pokémon');
      console.error(error);
    } else {
      alert('Pokémon updated successfully!');
      window.location.href = 'gallery.html';
    }
  });
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmDelete = confirm('Are you sure you want to delete this Pokémon?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('pokemon')
      .delete()
      .eq('id', currentId)
      .select();

    if (error) {
      alert('Failed to delete Pokémon.');
      console.error('Supabase Delete Error:', error);
    } else {
      alert('Pokémon deleted successfully!');
      window.location.href = 'gallery.html';
    }
  });
}

