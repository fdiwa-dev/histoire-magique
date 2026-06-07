import { StoryParams, Story, StoryPage, ExampleStory } from '../types';

// ─── Descriptions visuelles pour accessibilité (enfants non-voyants) ───
const DESCRIPTIONS_VISUELLES: Record<string, string> = {
  'space_cover': 'Couverture du livre : une fusée dorée file à travers un ciel constellé de milliers d\'étoiles scintillantes, avec une planète violette en arrière-plan.',
  'space_intro': 'Un enfant regarde par la fenêtre de sa chambre, dans le ciel étoilé une petite fusée dorée brillante descend doucement.',
  'space_launch': 'La fusée décolle dans un nuage de fumée orange et de flammes, des étincelles jaillissent de toutes parts.',
  'space_earth': 'La Terre vue de l\'espace : une magnifique boule bleue avec des continents verts, entourée d\'un halo lumineux et d\'étoiles.',
  'space_alien': 'Piko, un petit alien violet tout rond avec de grands yeux expressifs, agite ses tentacules en souriant sur une planète rose.',
  'space_obstacle': 'Un champ d\'astéroïdes dorés flottant dans le noir bloque le passage, des rochers anguleux aux reflets métalliques.',
  'space_solution': 'Un magnifique toboggan lumineux arc-en-ciel traverse le champ d\'astéroïdes, la fusée glisse joyeusement dessus.',
  'space_nebula': 'Une nébuleuse aux couleurs vibrantes, rose, violet et jaune s\'entremêlent comme une peinture cosmique géante.',
  'space_moral': 'Un grand cœur lumineux flotte dans l\'espace entouré d\'étoiles filantes et d\'une petite fusée qui tourne autour.',
  'pirate_cover': 'Couverture du livre : un bateau pirate aux voiles argentées navigue sur une mer turquoise au coucher du soleil.',
  'pirate_map': 'Une vieille carte au trésor en parchemin avec un chemin en pointillés rouges menant à un X marqué d\'or.',
  'pirate_ship': 'Un magnifique galion en bois, le Sillage d\'Or, flotte sur des vagues bleues, ses voiles blanches claquent au vent.',
  'pirate_ocean': 'L\'océan infini sous un soleil couchant, un dauphin bleu saute hors de l\'eau en traçant un arc argenté.',
  'pirate_parrot': 'Un perroquet roux coiffé d\'un chapeau de pirate tricorne portant un monocle, perché sur une branche.',
  'pirate_waterfall': 'Une immense cascade d\'eau scintillante tombe d\'une falaise dans un bassin d\'écume blanche.',
  'pirate_cave_open': 'Une grotte secrète éclairée par une lueur dorée, au centre une grosse clé en or sur un socle de pierre.',
  'pirate_treasure': 'Un coffre en bois débordant de pièces d\'or, un livre magique s\'en échappe aux pages illuminées.',
  'pirate_moral': 'Le navire rentre au port au coucher du soleil, le capitaine et le perroquet regardent l\'horizon, heureux.',
  'dragon_cover': 'Couverture : un majestueux dragon émeraude aux ailes déployées plane au-dessus d\'une vallée brumeuse.',
  'dragon_nest': 'Au sommet d\'une colline brumeuse, un gros œuf de dragon bleu repose sur un lit de feuilles de vigne magiques.',
  'dragon_hatch': 'Un gentil dragon vert nommé Barnabé sort de sa coquille d\'azur, son arrosoir en bois à la patte.',
  'dragon_sad': 'Barnabé le dragon est triste devant sa Tulipe de Lune fanée, ses larges ailes tombent mollement.',
  'dragon_flight': 'Le dragon déploie ses grandes ailes et s\'élance dans le ciel orangé avec son ami sur le dos.',
  'dragon_block': 'Un énorme rocher gris bouche la source d\'eau fraîche au sommet de la montagne, des mousses vertes le recouvrent.',
  'dragon_laugh': 'L\'enfant chatouille le rocher grincheux qui se met à rire et à bouger, libérant enfin l\'eau.',
  'dragon_bloom': 'La Tulipe de Lune s\'ouvre dans une lumière nacrée, illuminant toute la forêt de reflets argentés.',
  'dragon_moral': 'Le dragon et son ami regardent la lune se lever, leurs silhouettes se découpent sur le ciel étoilé.',
  'robot_cover': 'Couverture : un petit robot rouillé aux yeux bleus lumineux se tient dans un atelier d\'engrenages.',
  'robot_discover': 'Dans un atelier poussiéreux, un petit robot rouillé cligne de ses ampoules bleues, ses engrenages crissent doucement.',
  'robot_dream': 'Barnabé le robot regarde par la fenêtre, ses yeux d\'ampoule rêvent de couleurs vives et de paysages pastel.',
  'robot_dry': 'Devant lui, des pinceaux tout secs et cassés reposent sur une table en bois, la peinture est écaillée et grise.',
  'robot_berries': 'Des bols de purée de fruits violets, oranges et roses sont alignés, remplis de couleurs naturelles éclatantes.',
  'robot_paint': 'Le robot peint un tableau, des éclaboussures de peinture de toutes les couleurs volent autour de lui.',
  'robot_alive': 'Le mur s\'anime, un arbre magique aux feuilles dorées sort de la fresque, des lucioles fluorescentes dansent autour.',
  'robot_happy': 'Le cœur métallique de Barnabé s\'illumine d\'un doux rose lumineux, ses yeux forment des arcs-en-ciel.',
  'robot_moral': 'Barnabé assis dans l\'herbe entouré de fleurs et de papillons, le cœur illuminé de mille couleurs.',
  'forest_cover': 'Couverture : un sentier qui serpente dans une forêt enchantée aux arbres aux troncs lumineux.',
  'forest_intro': 'Une forêt dense aux arbres majestueux, la lumière filtre à travers les feuilles.',
  'forest_squirrel': 'Un écureuil au pelage argenté saute de branche en branche, ses yeux pétillent de malice.',
  'forest_fissure': 'Un gros rocher gris avec une fissure profonde, de la lumière dorée s\'échappe de la faille.',
  'forest_spell': 'Un enfant souffle doucement sur la pierre, un halo de lumière magique entoure ses mains.',
  'forest_floating': 'Une noisette dorée flotte dans les airs entourée de lucioles lumineuses en spirale.',
  'forest_gather': 'Une clairière enchantée remplie d\'animaux de la forêt qui forment un cercle joyeux.',
  'forest_bloom': 'Un grand arbre aux branches couvertes de fleurs lumineuses et de cristaux d\'ambre.',
  'forest_moral': 'La forêt baigne dans une douce lumière dorée, un enfant marche main dans la main avec un écureuil.',
  'default_intro': 'Un paysage merveilleux et coloré se dévoile sous un ciel clair et lumineux.',
  'default_encounter': 'Un personnage amical apparaît, le sourire aux lèvres, prêt à partager une aventure.',
  'default_challenge': 'Un obstacle se dresse sur le chemin, demandant du courage et de l\'ingéniosité.',
  'default_solution': 'Grâce à la ruse et à la gentillesse, une solution créative est trouvée, tout s\'illumine.',
  'default_journey': 'Le voyage se poursuit à travers des paysages enchanteurs et variés.',
  'default_moral': 'Le calme et la sérénité enveloppent la scène finale, le héros contemple le chemin parcouru.',
};

function getDescriptionVisuelle(sceneType: string): string {
  return DESCRIPTIONS_VISUELLES[sceneType] || DESCRIPTIONS_VISUELLES['default_intro'] || 'Illustration de la page.';
}

// Helper to determine the best theme/story based on user prompt keywords in French
export function matchThemeId(prompt: string): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('espace') || p.includes('étoile') || p.includes('etoile') || p.includes('fusée') || p.includes('fusee') || p.includes('planète') || p.includes('planete') || p.includes('alien') || p.includes('astronaute') || p.includes('lune') || p.includes('cosmos')) {
    return 'space';
  }
  if (p.includes('pirate') || p.includes('trésor') || p.includes('tresor') || p.includes('bateau') || p.includes('navire') || p.includes('océan') || p.includes('ocean') || p.includes('île') || p.includes('ile') || p.includes('mer') || p.includes('capitaine')) {
    return 'pirate';
  }
  if (p.includes('dragon') || p.includes('feu') || p.includes('grotte') || p.includes('écaille') || p.includes('grimoire') || p.includes('chevalier') || p.includes('donjon')) {
    return 'dragon';
  }
  if (p.includes('robot') || p.includes('boulon') || p.includes('ferraille') || p.includes('technologique') || p.includes('ordinateur') || p.includes('métal') || p.includes('metal')) {
    return 'robot';
  }
  if (p.includes('princesse') || p.includes('château') || p.includes('chateau') || p.includes('roi') || p.includes('reine') || p.includes('couronne') || p.includes('palais') || p.includes('royaume')) {
    return 'princess';
  }
  if (p.includes('chien') || p.includes('chat') || p.includes('chiot') || p.includes('animal') || p.includes('compagnon') || p.includes('biscotte') || p.includes('patte')) {
    return 'dog';
  }
  if (p.includes('nuage') || p.includes('voler') || p.includes('vent') || p.includes('oiseau') || p.includes('plume') || p.includes('ciel') || p.includes('montgolfière') || p.includes('montgolfiere')) {
    return 'castle';
  }
  if (p.includes('saison') || p.includes('hiver') || p.includes('glace') || p.includes('neige') || p.includes('printemps') || p.includes('été') || p.includes('ete') || p.includes('automne') || p.includes('fleur')) {
    return 'seasons';
  }
  if (p.includes('arbre') || p.includes('sagesse') || p.includes('racine') || p.includes('graine') || p.includes('forêt') || p.includes('foret') || p.includes('écureuil')) {
    return 'tree';
  }
  if (p.includes('forêt') || p.includes('foret') || p.includes('biche') || p.includes('loup') || p.includes('champignon') || p.includes('clairière') || p.includes('clairiere') || p.includes('luciole')) {
    return 'forest';
  }

  // Soft fallback: pick one that has a visual handler
  const index = p.length % 5;
  const list = ['forest', 'space', 'pirate', 'dragon', 'robot'];
  return list[index];
}

// 1. Text generator based on theme, child's name, age group and lesson.
// 8 pages per story.
export function generateStory(params: StoryParams): Story {
  const heroName = params.childName ? params.childName.trim() : 'Léo';
  let themeId = matchThemeId(params.titleDescription);
  
  const age = params.ageGroup;
  const style = params.illustrationStyle;
  const lesson = params.lesson;

  let title = '';
  const pages: StoryPage[] = [];
  let coverImageSeed = '';

  // Lesson segment mapping in French
  const getLessonMoral = (tId: string, hero: string): string => {
    switch (lesson) {
      case 'Amitié':
        return `Grâce à cette aventure, ${hero} comprit que le plus précieux des trésors n'est pas matériel : c'est un ami sincère avec qui partager ses sourires et ses rêves. Un ami éclaire les journées sombres d'une douce lumière magique.`;
      case 'Courage':
        return `En regardant le chemin parcouru, ${hero} réalisa que le courage ne consiste pas à ne jamais avoir peur, mais à avancer doucement malgré ses craintes. Chaque petit pas en avant transforme nos doutes en de merveilleuses victoires.`;
      case 'Partage':
        return `Le cœur léger, ${hero} apprit que le bonheur se multiplie toujours lorsqu'on le partage avec autrui. Offrir un bout de sa chance, un sourire ou un jouet rend le monde infiniment plus beau et chaleureux.`;
      case 'Différence':
        return `Cette rencontre unique apporta une belle leçon à ${hero} : nos différences ne sont pas des barrières, mais de magnifiques couleurs qui enrichissent notre monde. C'est notre diversité qui rend chaque histoire si extraordinaire.`;
      case 'Aventure':
        return `${hero} sut désormais que la vie est une merveilleuse aventure qui attend d'être vécue. Derrière chaque arbre, chaque planète et chaque nuage se cache un mystère qui ne demande qu'à être exploré avec curiosité.`;
      case 'Pas de leçon particulière':
      default:
        return `La tête encore pleine d'images fantastiques, ${hero} s'endormit paisiblement ce soir-là, impatient de fermer les yeux pour retrouver ses nouveaux amis dans le monde magique des rêves infinis.`;
    }
  };

  if (themeId === 'space') {
    title = `Le Voyage Cosmique de ${heroName}`;
    coverImageSeed = 'space_cover';
    
    const baseSpacePages = [
      {
        text: age === '2-4'
          ? `${heroName} regarde les étoiles brillantes ce soir. Oh ! Une petite fusée dorée tape doucement à sa fenêtre !`
          : age === '5-7'
            ? `Chaque soir, ${heroName} contemple le ciel étoilé depuis son lit. Ce soir-là, une étoile plus brillante que les autres descend du ciel et se pose doucement dans le jardin. C'est un petit vaisseau céleste en or !`
            : `Passionné par l'inconnu, ${heroName} passe des heures à étudier les constellations. Quelle ne fut pas sa surprise quand, ce vendredi soir, une nef spatiale miniature s'arrêta en parfait silence devant sa fenêtre ouverte.`,
        bg: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900',
        scene: 'space_intro'
      },
      {
        text: age === '2-4'
          ? `Hop ! ${heroName} monte dans la fusée. C'est tout doux dedans. Un, deux, trois... C'est parti vers le ciel !`
          : age === '5-7'
            ? `Sans hésiter, ${heroName} monte à bord du vaisseau. Les parois brillent d'une lueur violette et les boutons clignotent en chantant. "Paré au décollage !" murmure une voix douce.`
            : `Invitant le destin, ${heroName} franchit le sas du cockpit. L'intérieur est une merveille technologique : des cadrans holographiques projettent des cartes de galaxies lointaines. Le voyage commença dans un souffle de lumière.`,
        bg: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950',
        scene: 'space_launch'
      },
      {
        text: age === '2-4'
          ? `Regarde ! La Terre est une jolie bille bleue tout en bas dans le grand noir.`
          : age === '5-7'
            ? `À travers la vitre ronde, la Terre devient toute petite, semblable à une magnifique bille bleue et blanche posée sur un tapis de velours noir scintillant.`
            : `À mesure que la nef prenait de l'altitude, la Terre se révéla dans toute sa splendeur : une oasis d'azur et de nuages suspendue au milieu du vide infini, silencieuse et majestueuse.`,
        bg: 'bg-gradient-to-b from-purple-950 via-slate-950 to-black',
        scene: 'space_earth'
      },
      {
        text: age === '2-4'
          ? `Coucou ! Voici Piko, un drôle d'ami extraterrestre tout violet avec des yeux rieurs.`
          : age === '5-7'
            ? `Sur une planète recouverte de sable rose, ${heroName} rencontre Piko, un petit habitant de l'espace avec de grands yeux gentils, qui jongle joyeusement avec des bulles lumineuses.`
            : `Sur l'astre cristallin nommé Nova, ${heroName} fit la connaissance de Piko. Ce petit être de pure énergie bleutée s'exprimait par de doux bruits harmonieux et semblait ravi d'accueillir un explorateur terrestre.`,
        bg: 'bg-gradient-to-b from-fuchsia-950 via-purple-950 to-indigo-950',
        scene: 'space_alien'
      },
      {
        text: age === '2-4'
          ? `Attention ! De gros cailloux volants dorés bloquent le chemin de la fusée.`
          : age === '5-7'
            ? `Soudain, une pluie de météores brillants comme de l'or bloque la route de nos deux explorateurs. Impossible de passer tout droit !`
            : `Une alarme mélodieuse retentit. Un essaim d'astéroïdes de quartz doré flottait en travers de leur couloir spatial, barrant le passage vers la grande nébuleuse.`,
        bg: 'bg-gradient-to-b from-slate-950 via-purple-950 to-black',
        scene: 'space_obstacle'
      },
      {
        text: age === '2-4'
          ? `Piko et ${heroName} dessinent un toboggan d'étoiles pour glisser par-dessus ! Ouest !`
          : age === '5-7'
            ? `Ensemble, ${heroName} et Piko combinent leurs forces. Ils lancent de la poussière magique pour fabriquer un grand toboggan lumineux afin de glisser par-dessus l'obstacle.`
            : `Faisant preuve d'ingéniosité, ${heroName} configure le laser du vaisseau pour tracer un faisceau de gravité douce, créant un pont d'énergie pour surfer au-dessus du champ de décombres.`,
        bg: 'bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950',
        scene: 'space_solution'
      },
      {
        text: age === '2-4'
          ? `Le ciel est plein de belles couleurs bleues, roses et jaunes. C'est magique !`
          : age === '5-7'
            ? `Ils arrivent au cœur d'une splendide nébuleuse colorée, une mer céleste rose, jaune et violette où dansent de jeunes étoiles filantes sauvages.`
            : `La nef déboucha enfin au cœur d'une nébuleuse d'une beauté indicible, où des voiles de gaz pourpres et d'hélium doré s'enroulaient comme une grande peinture cosmique.`,
        bg: 'bg-gradient-to-b from-purple-900 to-indigo-950',
        scene: 'space_nebula'
      }
    ];

    baseSpacePages.forEach((bp, index) => {
      const pageNum = index + 1;
      pages.push({
        pageNumber: pageNum,
        text: bp.text,
        illustrationSeed: `${themeId}_p${pages.length + 1}_${style.toLowerCase()}`,
        backgroundClass: bp.bg,
        sceneType: bp.scene,
        isPremium: pageNum >= 4, // pages 4+ premium
      });
    });

    // Page 8: Moral
    pages.push({
      pageNumber: 8,
      text: getLessonMoral('space', heroName),
      illustrationSeed: `${themeId}_p8_${style.toLowerCase()}`,
      backgroundClass: 'bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950',
      sceneType: 'space_moral',
      isPremium: true,
    });

  } else if (themeId === 'pirate') {
    title = `L'Île aux Étoiles de ${heroName}`;
    coverImageSeed = 'pirate_cover';

    const basePiratePages = [
      {
        text: age === '2-4'
          ? `${heroName} trouve une carte au trésor sous son oreiller. En route pour le bateau magique !`
          : age === '5-7'
            ? `En rangeant ses livres de contes, ${heroName} découvre une mystérieuse carte dessinée sur un parchemin qui brille dans le noir. Elle mène à la légendaire Île aux Étoiles.`
            : `Au fond d'un vieux secrétaire familial, ${heroName} mit la main sur un parchemin scellé d'une ancre d'or. La boussole dessinée s'animait, pointant obstinément vers l'océan mystique des rêves.`,
        bg: 'bg-gradient-to-b from-sky-950 via-indigo-950 to-slate-900',
        scene: 'pirate_map'
      },
      {
        text: age === '2-4'
          ? `Le grand bateau de pirate vole sur l'eau bleue très claire.`
          : age === '5-7'
            ? `${heroName} monte à bord du "Sillage d'Or", un navire de bois poli dont les voiles sont tressées de fils d'argent parfumés par le vent salé.`
            : `Le navire de légende, baptisé le "Sillage d'Or", attendait dans une crique secrète. Ses membres de chêne marin brillaient sous l'effet d'une magie celte bienveillante.`,
        bg: 'bg-gradient-to-b from-sky-900 via-teal-950 to-indigo-950',
        scene: 'pirate_ship'
      },
      {
        text: age === '2-4'
          ? `Plouf ! Des jolis dauphins chantent des chansons drôles à côté d'eux.`
          : age === '5-7'
            ? `Pendant la traversée, des dauphins bleus sautent gaiement autour du gouvernail, traçant des arcs-en-ciel d'écume dans l'eau tiède.`
            : `Au large des récifs de nacre, une troupe de cétacés phosphorescents escorta le navire, entonnant un chant qui apaisait l'esprit et guidait les marins égarés.`,
        bg: 'bg-gradient-to-b from-blue-950 via-teal-900 to-indigo-950',
        scene: 'pirate_ocean'
      },
      {
        text: age === '2-4'
          ? `Voici Capitaine Plume, un joli perroquet rigolo avec un chapeau rouge.`
          : age === '5-7'
            ? `Le gardien de l'île est le Capitaine Plume, un perroquet bavard portant un mini monocle, qui connaît toutes les blagues du monde marin.`
            : `Sur la plage argentée de l'île, ${heroName} fut accueilli par le Capitaine Plume, un majestueux perroquet savant doté d'un esprit vif et d'un rire communicatif.`,
        bg: 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-900',
        scene: 'pirate_parrot'
      },
      {
        text: age === '2-4'
          ? `Zut alors ! Une grande cascade d'eau d'argent ferme la grotte ronde.`
          : age === '5-7'
            ? `Le chemin est caché derrière une immense cascade d'eau scintillante. L'eau coule si fort qu'on n'ose pas s'en approcher.`
            : `L'accès à la crypte de l'île était scellé par un rideau d'eau lourd, une cascade magique qui semblait chuchoter des énigmes impossibles à résoudre d'un simple regard.`,
        bg: 'bg-gradient-to-b from-teal-950 via-indigo-900 to-indigo-950',
        scene: 'pirate_waterfall'
      },
      {
        text: age === '2-4'
          ? `${heroName} chante une douce berceuse et... l'eau s'ouvre comme un rideau !`
          : age === '5-7'
            ? `Malicieusement, ${heroName} résout l'énigme du perroquet en imitant le chant du vent. La cascade s'ouvre alors comme deux rideaux magiques.`
            : `Faisant appel à ses souvenirs d'enfance, ${heroName} fredonna l'ancienne mélodie des vagues. Sensible à l'harmonie, le flot d'eau se sépara pour révéler un passage sec.`,
        bg: 'bg-gradient-to-b from-slate-900 via-teal-950 to-indigo-950',
        scene: 'pirate_cave_open'
      },
      {
        text: age === '2-4'
          ? `Youpi ! Dans le coffre, il y a un livre magique plein d'histoires !`
          : age === '5-7'
            ? `Au milieu de la grotte, le coffre s'ouvre. Pas d'or, mais un grand livre enchanté dont les pages volent joyeusement autour de la tête de ${heroName}.`
            : `Au centre de la cavité rocheuse reposait un écrin d'ébène. À l'intérieur demeurait le Grimoire Céleste, dont les pages diffusaient des récits de fées et d'univers lointains.`,
        bg: 'bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-900',
        scene: 'pirate_treasure'
      }
    ];

    basePiratePages.forEach((bp, index) => {
      const pageNum = index + 1;
      pages.push({
        pageNumber: pageNum,
        text: bp.text,
        illustrationSeed: `${themeId}_p${pageNum}_${style.toLowerCase()}`,
        backgroundClass: bp.bg,
        sceneType: bp.scene,
        isPremium: pageNum >= 4,
      });
    });

    pages.push({
      pageNumber: 8,
      text: getLessonMoral('pirate', heroName),
      illustrationSeed: `${themeId}_p8_${style.toLowerCase()}`,
      backgroundClass: 'bg-gradient-to-b from-blue-955 to-slate-950',
      sceneType: 'pirate_moral',
      isPremium: true,
    });

  } else if (themeId === 'dragon') {
    title = `Le Dragon Jardiner de ${heroName}`;
    coverImageSeed = 'dragon_cover';

    const baseDragonPages = [
      {
        text: age === '2-4'
          ? `${heroName} marche près des collines. Oh, un gros œuf de dragon tout bleu brille !`
          : age === '5-7'
            ? `En grimpant la Colline des Brumes, ${heroName} repère une étrange lueur verte cachée sous des feuilles de vigne magique.`
            : `Lors d'une expédition près du Mont d'Azur, ${heroName} aperçut une crevasse lumineuse révélant des parois rocheuses étrangement chaudes et douces.`,
        bg: 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-900',
        scene: 'dragon_nest'
      },
      {
        text: age === '2-4'
          ? `Crac ! Un gentil dragon vert sort de sa coquille d'azur.`
          : age === '5-7'
            ? `C'est Barnabé, un grand dragon vert au sourire timide. Contrairement aux autres, il préfère porter un joli arrosoir en bois.`
            : `Là demeurait Barnabé, un jeune dragon aux écailles de jade et aux yeux or. Ce dragon singulier refusait d'incendier les plaines, préférant cultiver de fragiles orchidées sauvages.`,
        bg: 'bg-gradient-to-b from-green-950 via-emerald-900 to-slate-900',
        scene: 'dragon_hatch'
      },
      {
        text: age === '2-4'
          ? `Mais Barnabé le dragon est triste : ses jolies roses ont soif de fraîcheur.`
          : age === '5-7'
            ? `Barnabé est un peu triste. Sa fleur préférée, la Grande Tulipe de Lune, est en train de faner car la source d'eau est tarie.`
            : `Le dragon confia son chagrin à ${heroName} : la Tulipe Céleste, source de l'équilibre de sa vallée florale, dépérissait suite à l'assèchement du ruisseau cristallin.`,
        bg: 'bg-gradient-to-b from-amber-950 via-emerald-950 to-slate-900',
        scene: 'dragon_sad'
      },
      {
        text: age === '2-4'
          ? `Hop ! Ils s'envolent ensemble dans le grand ciel orangé.`
          : age === '5-7'
            ? `Qu'à cela ne tienne ! ${heroName} grimpe sur le dos du dragon. Les ailes vertes se déploient dans un grand bruissement vers le sommet de la montagne.`
            : `N'écoutant que sa bienveillance, ${heroName} monta sur le dos robuste du dragon. Leurs ailes battirent le ciel, s'élevant vers la crête embrumée du volcan éteint.`,
        bg: 'bg-gradient-to-b from-orange-950 via-amber-950 to-slate-900',
        scene: 'dragon_flight'
      },
      {
        text: age === '2-4'
          ? `Regarde ! Un gros rocher gris dort juste sur la source d'eau.`
          : age === '5-7'
            ? `Arrivés en haut, ils découvrent qu'un rocher grincheux s'est endormi pile sur le trou de la source d'eau fraîche.`
            : `À la cime, la source sacrée était obstruée par un énorme bloc de granit volcanique qui bloquait le débit vital de la vallée fluviale.`,
        bg: 'bg-gradient-to-b from-slate-800 via-emerald-950 to-slate-950',
        scene: 'dragon_block'
      },
      {
        text: age === '2-4'
          ? `${heroName} fait des chatouilles et hop ! Le rocher rigole et bouge.`
          : age === '5-7'
            ? `${heroName} a une idée rigolote : il fait de grosses chatouilles sous les bras du rocher grincheux qui se met à rire et à bouger de côté !`
            : `Avec humour, ${heroName} commença à gratter les mousses vertes du bloc de granit. Pris d'un fou rire sonore, le rocher bascula, laissant jaillir un flot limpide.`,
        bg: 'bg-gradient-to-b from-sky-950 via-emerald-950 to-slate-900',
        scene: 'dragon_laugh'
      },
      {
        text: age === '2-4'
          ? `La belle tulipe brille comme la lune maintenant. C'est magnifique !`
          : age === '5-7'
            ? `L'eau coule à nouveau. La Tulipe de Lune s'ouvre doucement, diffusant une magnifique lumière nacrée qui illumine toute la forêt.`
            : `Le ruisseau libéré abreuva de nouveau la plaine. Sous leurs yeux émerveillés, la Tulipe Céleste s'épanouit, libérant un halo lumineux aux effluves ensorcelants.`,
        bg: 'bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-900',
        scene: 'dragon_bloom'
      }
    ];

    baseDragonPages.forEach((bp, index) => {
      const pageNum = index + 1;
      pages.push({
        pageNumber: pageNum,
        text: bp.text,
        illustrationSeed: `${themeId}_p${pageNum}_${style.toLowerCase()}`,
        backgroundClass: bp.bg,
        sceneType: bp.scene,
        isPremium: pageNum >= 4,
      });
    });

    pages.push({
      pageNumber: 8,
      text: getLessonMoral('dragon', heroName),
      illustrationSeed: `${themeId}_p8_${style.toLowerCase()}`,
      backgroundClass: 'bg-gradient-to-b from-emerald-950 via-indigo-950 to-slate-900',
      sceneType: 'dragon_moral',
      isPremium: true,
    });

  } else if (themeId === 'robot') {
    title = `La Peinture Magique de Barnabé`;
    coverImageSeed = 'robot_cover';

    const baseRobotPages = [
      {
        text: age === '2-4'
          ? `Voici Barnabé, un petit robot tout en métal gris brillant !`
          : age === '5-7'
            ? `Dans l'atelier des inventions oubliées vit Barnabé, un adorable petit automate métallique avec des ampoules bleues pour yeux.`
            : `Dans le sous-sol de l'observatoire aux merveilles, ${heroName} découvrit Barnabé, un petit robot mécanique abandonné, couvert de poussière mais pourvu de engrenages d'une infinie finesse.`,
        bg: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950',
        scene: 'robot_discover'
      },
      {
        text: age === '2-4'
          ? `Barnabé veut faire des jolis dessins de fleurs rouges, jaunes et bleues.`
          : age === '5-7'
            ? `Barnabé ne veut pas trier des puces électroniques. Son rêve à lui, c'est de peindre des couchers de soleil pleins de couleurs douces.`
            : `Loin des lignes de code et des tâches d'usine, Barnabé le petit robot nourrissait une passion secrète : capturer la nuance exacte de la rosée matinale sur une toile pastel.`,
        bg: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900',
        scene: 'robot_dream'
      },
      {
        text: age === '2-4'
          ? `Zut ! Ses pinceaux gris sont tout cassés et secs.`
          : age === '5-7'
            ? `Malheureusement, l'atelier ne contient pas de couleurs colorées. Les pinceaux de l'automate sont secs et usés.`
            : `Cependant, l'automate ne possédait aucun pigment. Les vieux pinceaux stockés dans ses compartiments de rangement étaient rigides et froids.`,
        bg: 'bg-gradient-to-b from-zinc-900 via-stone-900 to-zinc-950',
        scene: 'robot_dry'
      },
      {
        text: age === '2-4'
          ? `${heroName} prend des fruits de la forêt : des mûres et des citrons doux.`
          : age === '5-7'
            ? `Pour l'aider, ${heroName} ramasse des baies, des mûres sauvages et des fleurs de pissenlit pour fabriquer de magnifiques peintures naturelles.`
            : `Pour pallier cette pénurie, ${heroName} imagina une solution ingénieuse : presser des herbes aromatiques, des fraises juteuses et du pollen de dahlia pour fabriquer de superbes aquarelles bio.`,
        bg: 'bg-gradient-to-b from-teal-950 via-emerald-950 to-stone-900',
        scene: 'robot_berries'
      },
      {
        text: age === '2-4'
          ? `Chouette ! Barnabé trempe son bras mécanique dans la purée violette.`
          : age === '5-7'
            ? `Barnabé plonge joyeusement ses pinceaux de fortune dans les bols de jus de fruits colorés. Il commence à peindre frénétiquement sur un vieux carton !`
            : `Modifiant ses programmes moteurs, Barnabé intégra cette magnifique matière organique. Il se mit à dessiner sur les parois en bois d'une voute oubliée.`,
        bg: 'bg-gradient-to-b from-rose-950 via-purple-950 to-slate-900',
        scene: 'robot_paint'
      },
      {
        text: age === '2-4'
          ? `Regarde ! Un immense arbre magique apparaît sous ses doigts de fer.`
          : age === '5-7'
            ? `Sous les yeux de ${heroName}, la peinture prend vie ! Un magnifique arbre enchanté se déploie sur le mur, diffusant des éclats de lumière dorée.`
            : `La magie opéra : à mesure que les tracés de Barnabé séchaient, la fresque se mit à onduler, créant une fenêtre holographique sur une prairie baignée de soleil.`,
        bg: 'bg-gradient-to-b from-emerald-950 via-purple-950 to-slate-900',
        scene: 'robot_alive'
      },
      {
        text: age === '2-4'
          ? `Le petit cœur en fer de Barnabé s'allume en rose. Il est si heureux !`
          : age === '5-7'
            ? `Le petit cœur métallique de Barnabé brille de toutes les couleurs. Ses yeux d'ampoule clignotent en dessinant de mignons petits sourires.`
            : `Une charge d'électricité douce traversa les circuits du petit être métallique. Sur son moniteur facial s'afficha pour la première fois un immense cœur fuchsia.`,
        bg: 'bg-gradient-to-b from-pink-950 via-indigo-950 to-slate-900',
        scene: 'robot_happy'
      }
    ];

    baseRobotPages.forEach((bp, index) => {
      pages.push({
        pageNumber: index + 1,
        text: bp.text,
        illustrationSeed: `${themeId}_p${index + 1}_${style.toLowerCase()}`,
        backgroundClass: bp.bg,
        sceneType: bp.scene
      });
    });

    pages.push({
      pageNumber: 8,
      text: getLessonMoral('robot', heroName),
      illustrationSeed: `${themeId}_p8_${style.toLowerCase()}`,
      backgroundClass: 'bg-gradient-to-b from-indigo-950 to-slate-950',
      sceneType: 'robot_moral'
    });

  } else {
    // Default theme: forest ("La Forêt des Rêves Bleus") — utilisé aussi pour princess, castle, etc.
    themeId = 'forest';
    title = `La Forêt Enchantée de ${heroName}`;
    coverImageSeed = 'forest_cover';

    const baseForestPages = [
      {
        text: age === '2-4'
          ? `${heroName} marche sur le petit sentier de la grande forêt verte.`
          : age === '5-7'
            ? `En se promenant aux abords du bois magique, ${heroName} aperçoit une petite biche aux cornes ornées de fleurs lumineuses.`
            : `Lors d'une excursion au cœur de la Forêt Noire, ${heroName} découvrit un vieux chêne dont l'écorce luisait doucement sous la lumière lunaire.`,
        bg: 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-900',
        scene: 'forest_intro'
      },
      {
        text: age === '2-4'
          ? `Oh ! Un joli écureuil bleu fait de grands sauts dans les feuilles.`
          : age === '5-7'
            ? `C'est Plume, un écureuil facétieux au pelage d'argent, qui cherche activement ses noisettes perdues dans les buissons.`
            : `Plume, un écureuil blanc royal doué de télépathie, expliqua qu'un vent mauvais avait éparpillé les fruits sacrés de l'Arbre de Vie.`,
        bg: 'bg-gradient-to-b from-teal-950 via-green-950 to-slate-900',
        scene: 'forest_squirrel'
      },
      {
        text: age === '2-4'
          ? `L'écureuil cherche sa jolie noisette dorée cachée sous une pierre.`
          : age === '5-7'
            ? `Une des noisettes est coincée profondément dans la fente d'une immense pierre grise d'où s'échappent des sifflements harmonieux.`
            : `L'une des noisettes runiques reposait tout au fond d'une faille dans un mégalithe d'obsidienne, inaccessible pour de simples pattes d'animaux.`,
        bg: 'bg-gradient-to-b from-stone-900 via-emerald-950 to-slate-900',
        scene: 'forest_fissure'
      },
      {
        text: age === '2-4'
          ? `${heroName} souffle très fort sur la pierre. Ffhouuu !`
          : age === '5-7'
            ? `${heroName} chuchote doucement une formule secrète apprise dans ses livres : "Sésame enchanté, ouvre-toi !" et la fente de la pierre s'agrandit doucement.`
            : `Se remémorant une antique légende rupestre, ${heroName} posa ses mains sur la pierre et modula une onde sonore régulière. Vibrations après vibrations, la roche s'écarta gentiment.`,
        bg: 'bg-gradient-to-b from-teal-950 via-indigo-950 to-slate-900',
        scene: 'forest_spell'
      },
      {
        text: age === '2-4'
          ? `Gagné ! La belle noisette vole dans le ciel et envoie des bulles vertes.`
          : age === '5-7'
            ? `La noisette magique remonte toute seule ! Elle se met à flotter en libérant de jolies lucioles dorées qui dansent en rond.`
            : `La noisette runique s'éleva, libérant un nuage de spores magiques et de lucioles fluorescentes qui formèrent une piste au-dessus des cimes.`,
        bg: 'bg-gradient-to-b from-purple-950 via-teal-950 to-slate-900',
        scene: 'forest_floating'
      },
      {
        text: age === '2-4'
          ? `Tous les petits animaux de la forêt courent pour fêter ça !`
          : age === '5-7'
            ? `Ravis, les biches, les hérissons et les oiseaux de la clairière s'assemblent pour chanter un hymne de joie et de fête.`
            : `Bientôt, la clairière mystique s'anima. De magnifiques créatures sylvestres célébrèrent l'éveil du grand bosquet restauré.`,
        bg: 'bg-gradient-to-b from-emerald-950 via-indigo-950 to-slate-900',
        scene: 'forest_gather'
      },
      {
        text: age === '2-4'
          ? `L'Arbre de cristal brille maintenant avec de douces fleurs dorées.`
          : age === '5-7'
            ? `L'arbre central de la forêt s'illumine à nouveau, ses bourgeons se transforment en fleurs magiques qui sentent la fraise des bois.`
            : `Le grand chêne ancestral absorba l'énergie magique restituée, ses branches bourgeonnant de cristaux d'ambre aux reflets divins.`,
        bg: 'bg-gradient-to-b from-green-950 via-indigo-950 to-slate-900',
        scene: 'forest_bloom'
      }
    ];

    baseForestPages.forEach((bp, index) => {
      pages.push({
        pageNumber: index + 1,
        text: bp.text,
        illustrationSeed: `${themeId}_p${index + 1}_${style.toLowerCase()}`,
        backgroundClass: bp.bg,
        sceneType: bp.scene
      });
    });

    pages.push({
      pageNumber: 8,
      text: getLessonMoral('forest', heroName),
      illustrationSeed: `${themeId}_p8_${style.toLowerCase()}`,
      backgroundClass: 'bg-gradient-to-b from-emerald-950 to-slate-950',
      sceneType: 'forest_moral'
    });
  }

  // Enrichir chaque page avec sa description visuelle pour l'accessibilité
  const pagesWithDescription = pages.map((p) => ({
    ...p,
    descriptionVisuelle: DESCRIPTIONS_VISUELLES[p.sceneType] || 'Illustration de la scène.',
  }));

  return {
    id: `story_${Date.now()}`,
    title,
    params,
    pages: pagesWithDescription,
    heroName,
    coverImageSeed,
    themeId
  };
}

// 2. Predefined examples showcase matching the requirement
export const EXAMPLE_STORIES: ExampleStory[] = [
  {
    title: "Le Chêne aux Lucioles",
    description: "Un jeune renardeau apprend à surmonter sa peur du noir dans une forêt qui s'éveille.",
    age: "2-4 ans",
    style: "Aquarelle",
    lesson: "Courage",
    imageSeed: "forest_p1_aquarelle",
    color: "from-emerald-900/60 to-purple-900/60"
  },
  {
    title: "L'Ami Cosmique de Théo",
    description: "Un voyage au-delà de la Voie Lactée pour découvrir qu'un rictus d'alien vaut toutes les richesses.",
    age: "5-7 ans",
    style: "Réaliste",
    lesson: "Amitié",
    imageSeed: "space_p4_réaliste",
    color: "from-indigo-900/60 to-purple-900/60"
  },
  {
    title: "Barnabé Dessine son Cœur",
    description: "Un automate mécanique s'aperçoit que les couleurs naturelles recèlent un parfum de poésie.",
    age: "8-10 ans",
    style: "BD",
    lesson: "Partage",
    imageSeed: "robot_p5_bd",
    color: "from-rose-900/60 to-slate-900/60"
  }
];
