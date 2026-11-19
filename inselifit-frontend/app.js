// inseliFit frontend prototype. Authentication, LLM responses and APIs are integration points.
document.addEventListener('DOMContentLoaded', () => {
  // Login / create-account tabs
  const authForm = document.querySelector('[data-auth-form]');
  if (authForm) {
    const notice = document.querySelector('.notice');
    const tabs = document.querySelectorAll('[data-tab]');
    const loginFields = document.querySelector('[data-login-fields]');
    const registerFields = document.querySelector('[data-register-fields]');
    const submit = document.querySelector('[data-submit]');
    const subtitle = document.querySelector('[data-subtitle]');
    let mode = 'login';
    function setMode(next) {
      mode = next;
      const isRegister = mode === 'register';
      tabs.forEach(tab => { const active = tab.dataset.tab === mode; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); });
      loginFields.hidden = isRegister;
      if (registerFields) registerFields.hidden = !isRegister;
      if (submit) submit.hidden = isRegister && !!registerFields;
      if (submit) submit.textContent = 'Continue';
      if (subtitle) subtitle.textContent = isRegister ? 'Your profile starts with a conversation, not a long form.' : 'Welcome back. Sign in to continue your journey.';
      notice?.classList.remove('show');
    }
    tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.tab)));
    authForm.addEventListener('submit', event => {
      event.preventDefault();
      if (mode === 'login') {
        notice.textContent = 'Frontend preview: your teammate will connect the authentication service and login API here.';
        notice.classList.add('show');
      }
    });
    document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
      notice.textContent = `${button.dataset.social} sign-in is a visual placeholder and will be connected by the authentication workstream.`;
      notice.classList.add('show');
    }));
  }

  // Conversational profile capture prototype. Replace scripted prompts with the LLM API later.
  const chatForm = document.getElementById('chat-form');
  if (!chatForm) return;
  const role = document.body.dataset.profileRole;
  const isUser = role === 'user';
  const questions = isUser ? [
    {key:'preferredName', label:'Preferred name', prompt:'First, what would you like us to call you?', hint:'e.g. Alex'},
    {key:'fitnessGoals', label:'Fitness goals', prompt:'What would you most like to work towards? You can mention one goal or a few.', hint:'e.g. improve overall fitness, build strength, lose weight', suggestions:['Improve overall fitness','Build strength','Lose weight']},
    {key:'trainerPreference', label:'Trainer preference', prompt:'Do you have a preference for the trainer you may work with?', hint:'e.g. No preference', suggestions:['Female trainer','Male trainer','No preference']},
    {key:'healthConcerns', label:'Health concerns', prompt:'Are there any health concerns you would like us to record? You can also say “None”.', hint:'Share only what you are comfortable sharing', suggestions:['None','Prefer to discuss later']}
  ] : [
    {key:'preferredName', label:'Preferred name', prompt:'Let’s start with your name. What would you like clients to call you?', hint:'e.g. Alex'},
    {key:'certificationNumber', label:'Certification number', prompt:'What is your trainer certification number? If you have more than one, you can include them.', hint:'Enter certification number or say “Not applicable”'},
    {key:'experience', label:'Training experience', prompt:'How much training experience do you have? Tell me about the number of years and the kind of work you’ve done.', hint:'e.g. 5 years working with beginners'},
    {key:'specialities', label:'Specialities', prompt:'What are your training specialities?', hint:'e.g. gym training, yoga, Pilates', suggestions:['Gym training','Yoga','Pilates','Strength & conditioning']},
    {key:'healthExperience', label:'Relevant client experience', prompt:'Do you have experience or knowledge supporting clients with specific health conditions, such as diabetes or high cholesterol? Please describe your experience — this is not a medical assessment.', hint:'Describe your relevant experience or say “None”'}
  ];
  const answers = {};
  let current = 0;
  const messages = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const suggestions = document.getElementById('suggestion-row');
  const progress = document.getElementById('progress-fill');
  const stepLabel = document.getElementById('step-label');
  const review = document.getElementById('profile-review');
  const summary = document.getElementById('profile-summary');
  function addMessage(text, who='assistant') {
    const row = document.createElement('div'); row.className = `chat-message ${who}`;
    if (who === 'assistant') { const avatar = document.createElement('span'); avatar.className='message-avatar'; avatar.textContent='✦'; row.appendChild(avatar); }
    const bubble = document.createElement('div'); bubble.className='message-bubble';
    const p = document.createElement('p'); p.textContent=text; bubble.appendChild(p); row.appendChild(bubble); messages.appendChild(row); messages.scrollTop=messages.scrollHeight;
  }
  function showQuestion() {
    const q=questions[current]; stepLabel.textContent=`Question ${current+1} of ${questions.length}`;
    progress.style.width=`${(current/questions.length)*100}%`;
    addMessage(q.prompt); input.placeholder=q.hint; input.value=''; input.focus();
    suggestions.innerHTML=''; (q.suggestions||[]).forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='suggestion-chip';b.textContent=choice;b.addEventListener('click',()=>submitAnswer(choice));suggestions.appendChild(b);});
  }
  function submitAnswer(value) {
    const answer=value.trim(); if(!answer) return;
    addMessage(answer,'user'); answers[questions[current].key]=answer; current++;
    suggestions.innerHTML='';
    if(current<questions.length) setTimeout(showQuestion,250); else setTimeout(showReview,250);
  }
  function showReview() {
    progress.style.width='100%'; stepLabel.textContent='Review your details';
    addMessage('Thank you. I’ve organised what you shared into a profile preview. Please review it and make sure it reflects you accurately.');
    summary.innerHTML='';
    questions.forEach(q=>{const item=document.createElement('div');item.className='summary-item';const label=document.createElement('span');label.textContent=q.label;const value=document.createElement('strong');value.textContent=answers[q.key]||'—';item.append(label,value);summary.appendChild(item);});
    review.hidden=false; chatForm.hidden=true; suggestions.hidden=true;
  }
  chatForm.addEventListener('submit',e=>{e.preventDefault();submitAnswer(input.value);});
  document.getElementById('edit-answers').addEventListener('click',()=>{review.hidden=true;chatForm.hidden=false;suggestions.hidden=false;current=0;messages.innerHTML='';addMessage('Of course. Let’s go through your answers again.');showQuestion();});
  document.getElementById('finish-profile').addEventListener('click',()=>{addMessage('Your profile preview is complete. In the integrated version, this is where the profile API will submit the reviewed details to the backend.');document.getElementById('finish-profile').textContent='Preview complete';document.getElementById('finish-profile').disabled=true;});
  showQuestion();
});
