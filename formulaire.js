    <script>
        // Affichage des étapes
        function showStep(stepId) {
            document.querySelectorAll('.step').forEach(div => div.classList.remove('active'));
            document.getElementById(stepId).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Utilitaire pour la date JJ/MM/AAAA
        function getCurrentDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // =================== ADHESION EVENTS =====================
        function purgeAdhesionFields() {
            const form = document.getElementById('adhesionForm');
            if (!form) return;
            form.reset();
            form.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
            form.querySelectorAll('input').forEach(input => input.setCustomValidity(''));
        }
        document.getElementById('resetAdhesion').onclick = purgeAdhesionFields;
        window.addEventListener('load', purgeAdhesionFields);

        // Gestion du champ NOM (adhésion)
        document.getElementById('nom').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '').toUpperCase();
            e.target.value = value;
        });
        // Prénom
        document.getElementById('prenom').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ \-]/g, '');
            value = value.split(/[\s-]/).map(part => part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '').join('-');
            e.target.value = value;
        });
        // Ville
        document.getElementById('ville').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '').toUpperCase();
            e.target.value = value;
        });
        // Date de naissance
        const dateInput = document.getElementById('dateNaissance');
        dateInput.addEventListener('keydown', function(e) {
            const allowedKeys = ['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (allowedKeys.includes(e.key)) return;
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
        dateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '').substring(0, 8);
            const dateError = document.getElementById('dateError');
            if (value.length) {
                let formattedDate = '';
                if (value.length > 0) formattedDate += value.substring(0, 2);
                if (value.length > 2) formattedDate += '/' + value.substring(2, 4);
                if (value.length > 4) formattedDate += '/' + value.substring(4, 8);
                e.target.value = formattedDate;
                if (value.length === 8) {
                    const day = parseInt(value.substring(0, 2), 10);
                    const month = parseInt(value.substring(2, 4), 10);
                    const year = parseInt(value.substring(4, 8), 10);
                    const date = new Date(year, month - 1, day);
                    const valid = date.getDate() === day &&
                        date.getMonth() === month - 1 &&
                        date.getFullYear() === year &&
                        year >= 1900 &&
                        year <= new Date().getFullYear();
                    dateError.style.display = valid ? 'none' : 'block';
                    dateInput.setCustomValidity(valid ? '' : 'Date invalide');
                }
            } else {
                dateError.style.display = 'none';
                dateInput.setCustomValidity('');
            }
        });
        // Code postal
        const cpInput = document.getElementById('cp');
        cpInput.addEventListener('keydown', function(e) {
            const allowedKeys = ['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (allowedKeys.includes(e.key)) return;
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
        cpInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 5); // Max 5 chiffres
            const cpError = document.getElementById('cpError');
            if (value.length > 2) value = value.substring(0, 2) + ' ' + value.substring(2);
            e.target.value = value;
            const valid = /^\d{2} \d{3}$/.test(e.target.value);
            cpError.style.display = valid ? 'none' : 'block';
            cpInput.setCustomValidity(valid ? '' : 'Code postal invalide');
        });
        // Mobile
        const mobileInput = document.getElementById('mobile');
        const mobileError = document.getElementById('mobileError');
        mobileInput.addEventListener('keydown', function(e) {
            const allowedKeys = ['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (allowedKeys.includes(e.key)) return;
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
        mobileInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 10);
            if (value.length > 0) value = value.match(/.{1,2}/g)?.join(' ') || '';
            e.target.value = value;
            const numericValue = value.replace(/\s/g, '');
            const isValid = numericValue.length === 10 &&
                (numericValue.startsWith('06') || numericValue.startsWith('07'));
            mobileError.style.display = isValid ? 'none' : 'block';
            mobileInput.setCustomValidity(isValid ? '' : 'Numéro de mobile invalide');
            if (!isValid && numericValue.length === 10) {
                mobileError.textContent = 'Le numéro doit commencer par 06 ou 07';
            } else {
                mobileError.textContent = 'Format : 06 XX XX XX XX ou 07 XX XX XX XX';
            }
        });

        // Soumission du formulaire d’adhésion
        document.getElementById('adhesionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Création des données CSV
            const data = [
                '2025/2026',
                document.querySelector('input[name="civilite"]:checked')?.value || '',
                document.getElementById('nom').value.trim(),
                document.getElementById('prenom').value.trim(),
                document.getElementById('dateNaissance').value.trim(),
                document.getElementById('adresse').value.trim(),
                document.getElementById('cp').value.trim(),
                document.getElementById('ville').value.trim(),
                document.getElementById('email').value.trim(),
                document.getElementById('mobile').value.trim(),
                document.getElementById('am').checked ? 'Yes' : 'Off',
                document.getElementById('ems').checked ? 'Yes' : 'Off',
                document.getElementById('skate').checked ? 'Yes' : 'Off',
                document.getElementById('gymadapt').checked ? 'Yes' : 'Off',
                document.getElementById('gymcarte').checked ? 'Yes' : 'Off',
                document.getElementById('gymchaise').checked ? 'Yes' : 'Off',
                document.getElementById('yogagym').checked ? 'Yes' : 'Off',
                document.getElementById('mvsd').checked ? 'Yes' : 'Off',
                document.getElementById('gymsouplesse').checked ? 'Yes' : 'Off',
                document.getElementById('gymsenior').checked ? 'Yes' : 'Off',
                document.getElementById('pilates').checked ? 'Yes' : 'Off',
                document.getElementById('gymtonique').checked ? 'Yes' : 'Off',
                document.getElementById('mn').checked ? 'Yes' : 'Off',
                document.getElementById('multisports').checked ? 'Yes' : 'Off',
                document.getElementById('jeuxsociete').checked ? 'Yes' : 'Off',
                document.getElementById('textfield5').value.trim(),
                document.getElementById('textfield6').value.trim(),
                document.getElementById('textfield7').value.trim(),
                document.querySelector('input[name="tarif"]:checked')?.value || '',
                document.querySelector('input[name="sante"]:checked')?.value || '',
                document.getElementById('reglement').checked ? 'Yes' : 'Off',
                document.querySelector('input[name="image"]:checked')?.value || '',
                document.getElementById('paiement').checked ? 'Yes' : 'Off'
            ].join(';');

            const headers = 'Année;Mr/Mme;Nom;Prénom;Date Naissance;Adresse;CP;Ville;Courriel;Mobile;AM < 3 ans;EMS PE 3/6;Skate;GymAdapt;GymCarte;GymChaise;YogaGym;MVSD;GymSouplesse;GymSénior;Pilates;GymTonique;MN;MultiSports;JeuxSociété;TextField_5;TextField_6;TextField_7;TarifsX;Santé;Règlement Intérieur;Image;Cotisation';
            const csvContent = '\ufeff' + headers + '\n' + data;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            const fileName = `${document.getElementById('nom').value.trim()} ${document.getElementById('prenom').value.trim()}_Adhésion_25-26.csv`;
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Pré-remplir les questionnaires santé avec nom/prénom/civilité
            document.getElementById('nomAdulte').value = document.getElementById('nom').value.trim();
            document.getElementById('prenomAdulte').value = document.getElementById('prenom').value.trim();
            document.getElementById('nomMineur').value = document.getElementById('nom').value.trim();
            document.getElementById('prenomMineur').value = document.getElementById('prenom').value.trim();
			const civ = document.querySelector('input[name="civilite"]:checked')?.value;
			if (civ === 'Mr') {
				document.getElementById('mrAdulte').checked = true;
				// Pour le questionnaire mineur, coche "G" (Garçon) si Mr
				document.getElementById('G').checked = true;
			} else if (civ === 'Mme') {
				document.getElementById('mmeAdulte').checked = true;
				// Pour le questionnaire mineur, coche "F" (Fille) si Mme
				document.getElementById('F').checked = true;
			}
            // Date pour questionnaires
            document.getElementById('dateAdulte').value = getCurrentDate();
            document.getElementById('dateMineur').value = getCurrentDate();

            // Calcule l’âge à partir de la date de naissance
			function getAgeFromBirthdate(birthdate) {
				// birthdate format: JJ/MM/AAAA
				if (!birthdate) return NaN;
				const [day, month, year] = birthdate.split('/');
				if (!day || !month || !year) return NaN;
				const birth = new Date(`${year}-${month}-${day}`);
				const today = new Date();
				let age = today.getFullYear() - birth.getFullYear();
				const m = today.getMonth() - (birth.getMonth());
				if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
				return age;
			}

			// ... dans la fonction d'export du formulaire d’adhésion :
			const birthdate = document.getElementById('dateNaissance').value.trim();
			const age = getAgeFromBirthdate(birthdate);

			if (!isNaN(age)) {
				if (age < 18) {
					// Pré-remplir l'âge dans le questionnaire mineur
					document.getElementById('ageMineur').value = age;
					showStep('step-sante-mineur');
				} else {
					showStep('step-sante-adulte');
				}
			} else {
				showStep('step-choix-sante');
			}
        });

        // =================== CHOIX SANTE =====================
        document.getElementById('btn-sante-adulte').onclick = function() {
            showStep('step-sante-adulte');
        };
        document.getElementById('btn-sante-mineur').onclick = function() {
            showStep('step-sante-mineur');
        };

        // =================== SANTE ADULTE EVENTS =====================
        function purgeSanteAdulteFields() {
            const form = document.getElementById('santeAdulteForm');
            if (!form) return;
            form.reset();
            document.getElementById('dateAdulte').value = getCurrentDate();
            form.querySelectorAll('input[type="checkbox"]').forEach(c => c.nextElementSibling?.classList.remove('text-red'));
        }
        document.getElementById('resetSanteAdulte').onclick = purgeSanteAdulteFields;
        window.addEventListener('load', () => {
            document.getElementById('dateAdulte').value = getCurrentDate();
        });
        // Nom/prénom auto-maj/adulte
        document.getElementById('nomAdulte').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '').toUpperCase();
        });
        document.getElementById('prenomAdulte').addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ \-]/g, '');
            value = value.split(/[\s-]/).map(part => part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '').join('-');
            e.target.value = value;
        });
        // Couleur label
        document.querySelectorAll('#santeAdulteForm input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                const label = e.target.nextElementSibling;
                if (e.target.checked) label.classList.add('text-red');
                else label.classList.remove('text-red');
            });
        });
        // Imprimer
        document.getElementById('printSanteAdulte').onclick = () => window.print();
        // Export CSV adulte
        document.getElementById('santeAdulteForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const data = [
                '2025/2026',
                document.querySelector('input[name="civiliteAdulte"]:checked')?.value || '',
                document.getElementById('nomAdulte').value.trim(),
                document.getElementById('prenomAdulte').value.trim(),
                document.getElementById('q1Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q2Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q3Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q4Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q5Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q6Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q7Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q8Adulte').checked ? 'Yes' : 'No',
                document.getElementById('q9Adulte').checked ? 'Yes' : 'No',
                document.getElementById('dateAdulte').value.trim()
            ].join(';');
            const headers = 'Année;Mr/Mme;Nom;Prénom;Q1;Q2;Q3;Q4;Q5;Q6;Q7;Q8;Q9;Date';
            const csvContent = '\ufeff' + headers + '\n' + data;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            const fileName = `${document.getElementById('nomAdulte').value.trim()} ${document.getElementById('prenomAdulte').value.trim()}_Questionnaire Santé Adulte_25-26.csv`;
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.getElementById('sendEmailAdulte').disabled = false;
        });
        document.getElementById('sendEmailAdulte').addEventListener('click', function() {
			const nom = document.getElementById('nom').value.trim();
			const prenom = document.getElementById('prenom').value.trim();
			const adhesionFileName = `${nom} ${prenom}_Adhésion_25-26.csv`;
			const adulteFileName = `${nom} ${prenom}_Questionnaire Santé Adulte_25-26.csv`;
			const recipient = 'lentrainpourtous@epts.fr';
			const subject = 'Inscription : fichiers CSV en pièce jointe';
			const body = `Bonjour,

			Merci de joindre en pièce jointe 📎 les DEUX fichiers "*.csv" que vous venez de créer :
			- Votre fiche d’adhésion
			- Votre questionnaire santé

			Noms des fichiers :
			- ${adhesionFileName}
			- ${adulteFileName}

			Pour cela, cliquez sur l’icône 📎 (trombone) dans votre outil/interface de messagerie, puis sélectionnez les deux fichiers dans votre dossier "Téléchargement".

			Sans ces deux pièces jointes, votre inscription ne pourra pas être traitée.

			Cordialement,
			L’équipe de l’Entrain Pour Tous`;
            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        });

        // =================== SANTE MINEUR EVENTS =====================
		function purgeSanteMineurFields() {
			const form = document.getElementById('santeMineurForm');
			if (!form) return;
			form.reset();
			document.getElementById('dateMineur').value = getCurrentDate();
			form.querySelectorAll('input[type="checkbox"]').forEach(c => c.nextElementSibling?.classList.remove('text-red'));
		}
		document.getElementById('resetSanteMineur').onclick = purgeSanteMineurFields;
		window.addEventListener('load', () => {
			document.getElementById('dateMineur').value = getCurrentDate();
		});
		// Majuscules, prénom, etc.
		document.getElementById('nomMineur').addEventListener('input', function(e) {
			e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '').toUpperCase();
		});
		document.getElementById('prenomMineur').addEventListener('input', function(e) {
			let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ \-]/g, '');
			value = value.split(/[\s-]/).map(part => part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '').join('-');
			e.target.value = value;
		});
		document.getElementById('nomreplegMineur').addEventListener('input', function(e) {
			e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '').toUpperCase();
		});
		document.getElementById('prenomreplegMineur').addEventListener('input', function(e) {
			let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ \-]/g, '');
			value = value.split(/[\s-]/).map(part => part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '').join('-');
			e.target.value = value;
		});

		// Couleur label
		document.querySelectorAll('#santeMineurForm input[type="checkbox"]').forEach(checkbox => {
			checkbox.addEventListener('change', function(e) {
				const label = e.target.nextElementSibling;
				if (e.target.checked) label.classList.add('text-red');
				else label.classList.remove('text-red');
			});
		});
		// Imprimer
		document.getElementById('printSanteMineur').onclick = () => window.print();
		// Export CSV mineur
		document.getElementById('santeMineurForm').addEventListener('submit', function(e) {
			e.preventDefault();
			const data = [
				'2025/2026',
				document.querySelector('input[name="civiliteMineur"]:checked')?.value || '',
				document.getElementById('nomMineur').value.trim(),
				document.getElementById('prenomMineur').value.trim(),
				document.getElementById('ageMineur').value.trim(),
				document.getElementById('nomreplegMineur').value.trim(),
				document.getElementById('prenomreplegMineur').value.trim(),
				document.getElementById('q1Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q2Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q3Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q4Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q5Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q6Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q7Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q8Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q9Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q10Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q11Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q12Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q13Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q14Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q15Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q16Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q17Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q18Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q19Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q20Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q21Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q22Mineur').checked ? 'Yes' : 'No',
				document.getElementById('q23Mineur').checked ? 'Yes' : 'No',
				document.getElementById('dateMineur').value.trim()
			].join(';');
			const headers = 'Année;G/F;Nom;Prénom;Âge;NomRepLég;PrénomRepLég;Q1;Q2;Q3;Q4;Q5;Q6;Q7;Q8;Q9;Q10;Q11;Q12;Q13;Q14;Q15;Q16;Q17;Q18;Q19;Q20;Q21;Q22;Q23;Date';
			const csvContent = '\ufeff' + headers + '\n' + data;
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			const fileName = `${document.getElementById('nomMineur').value.trim()} ${document.getElementById('prenomMineur').value.trim()}_Questionnaire Santé Mineur_25-26.csv`;
			link.setAttribute("href", url);
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			document.getElementById('sendEmailMineur').disabled = false;
		});
			document.getElementById('sendEmailMineur').addEventListener('click', function() {
			const nom = document.getElementById('nom').value.trim();
			const prenom = document.getElementById('prenom').value.trim();
			const adhesionFileName = `${nom} ${prenom}_Adhésion_25-26.csv`;
			const mineurFileName = `${nom} ${prenom}_Questionnaire Santé Mineur_25-26.csv`;
			const recipient = 'lentrainpourtous@epts.fr';
			const subject = 'Inscription : fichiers CSV en pièce jointe';
			const body = `Bonjour,

			Merci de joindre en pièce jointe 📎 les DEUX fichiers "*.csv" que vous venez de créer :
			- Votre fiche d’adhésion
			- Votre questionnaire santé

			Noms des fichiers :
			- ${adhesionFileName}
			- ${mineurFileName}

			Pour cela, cliquez sur l’icône 📎 (trombone) dans votre outil/interface de messagerie, puis sélectionnez les deux fichiers dans votre dossier "Téléchargement".

			Sans ces deux pièces jointes, votre inscription ne pourra pas être traitée.

			Cordialement,
			L’équipe de l’Entrain Pour Tous`;
			const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
			window.location.href = mailtoLink;
		});
    </script>