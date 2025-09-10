import { Component } from '@angular/core';

@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.scss']
})
export class VoyageComponent {
  parisOptions = [
    {
      title: 'Option 1 : Via Valence & Gap (sans voiture)',
      steps: [
        'TGV Paris → TER Valence → Gap : ~5h30',
        'ou',
        'Train de nuit Paris → Gap : ~9h',
        'Navette ou location vers Barcelonnette : ~1h'
      ],
      note: 'Idéal pour ceux qui ne souhaitent pas conduire.'
    },
    {
      title: 'Option 2 : Via Aix-en-Provence',
      steps: [
        'TGV Paris → Aix-en-Provence : ~3h',
        'Location de voiture à Aix',
        'Conduite Aix → Pra-Loup : ~2h30 (autoroute + route de montagne facile)'
      ],
      note: 'Pratique avec une voiture, trajet confortable.'
    },
    {
      title: 'Option 3 : Via Lyon ou Grenoble',
      steps: [
        'TGV Paris → Lyon-Saint-Exupéry ou Grenoble : ~2h30–3h',
        'Location de voiture',
        'Conduite Lyon/Grenoble → Pra-Loup : ~3h'
      ],
      note: 'Bonne option si vous préférez arriver par Lyon ou Grenoble.'
    }
  ];

  dijonOption = {
    title: 'Depuis Dijon',
    steps: [
      'Trajet en voiture : ~5h30 à 6h',
      'Itinéraire conseillé : Dijon → Veynes → Barcelonnette → Pra-Loup'
    ],
    note: '⚠️ Il est fortement recommandé d’avoir des pneus neige ou chaines.'
  };
}
