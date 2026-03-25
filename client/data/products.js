export const users = [
    { id: 'u1', name: 'Lucas M.', avatar: 'https://i.pravatar.cc/48?img=1' },
    { id: 'u2', name: 'Sophie B.', avatar: 'https://i.pravatar.cc/48?img=5' },
    { id: 'u3', name: 'Antoine R.', avatar: 'https://i.pravatar.cc/48?img=12' },
    { id: 'u4', name: 'Camille D.', avatar: 'https://i.pravatar.cc/48?img=47' },
    { id: 'u5', name: 'Nicolas P.', avatar: 'https://i.pravatar.cc/48?img=33' },
    { id: 'u6', name: 'Julie F.', avatar: 'https://i.pravatar.cc/48?img=9' },
    { id: 'u7', name: 'Thomas G.', avatar: 'https://i.pravatar.cc/48?img=15' },
    { id: 'u8', name: 'Emma L.', avatar: 'https://i.pravatar.cc/48?img=44' },
];

export const products = [
    {
        id: '101',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    },
    {
        id: '1011',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1012',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1013',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1014',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1015',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1016',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1017',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    }, {
        id: '1018',
        name: 'MacBook Pro 16" M3 Max',
        category: 'Electronics',
        subcategory: 'macbook',
        priceCents: 349900,
        description: 'L\'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Gris Sidéral', color: '#636366' },
                    { value: 'Argent', color: '#e0e0e0' }
                ]
            },
            {
                label: 'Mémoire RAM',
                type: 'text',
                options: [
                    { value: '36 Go' },
                    { value: '48 Go' },
                    { value: '128 Go' }
                ]
            },
            {
                label: 'Stockage',
                type: 'text',
                options: [
                    { value: '512 Go' },
                    { value: '1 To' },
                    { value: '2 To' }
                ]
            }
        ],
        characteristics: [
            { label: 'Processeur', value: 'Apple M3 Max' },
            { label: 'RAM', value: '48 Go' },
            { label: 'Stockage', value: '1 To SSD' },
            { label: 'Écran', value: '16" Retina XDR, 3456x2234' },
            { label: 'Autonomie', value: 'Jusqu\'à 22h' },
            { label: 'Poids', value: '2.14 kg' },
            { label: 'Ports', value: '3x Thunderbolt 4, HDMI, SD' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    },
    {
        id: '102',
        name: 'Casque Audio Sony WH-1000XM5',
        category: 'Electronics',
        subcategory: 'casque audio',
        priceCents: 39900,
        description: 'Le meilleur casque à réduction de bruit du marché. Plongez dans votre musique avec un confort inégalé et un son Hi-Res spectaculaire.',
        images: [
            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Noir', color: '#1a1a1a' },
                    { value: 'Platine', color: '#b0a090' }
                ]
            },
            {
                label: 'Réduction de bruit',
                type: 'text',
                options: [
                    { value: 'ANC Actif' },
                    { value: 'Mode ambiance' }
                ]
            }
        ],
        characteristics: [
            { label: 'Réduction de bruit', value: 'Active (ANC)' },
            { label: 'Autonomie', value: '30h (ANC activé)' },
            { label: 'Connexion', value: 'Bluetooth 5.2 / Jack 3.5mm' },
            { label: 'Codec', value: 'LDAC, AAC, SBC' },
            { label: 'Poids', value: '250 g' },
            { label: 'Pliable', value: 'Oui' },
            { label: 'Microphone', value: 'Intégré (8 micros)' },
            { label: 'Garantie', value: '1 an constructeur' },
        ]
    },
    {
        id: '201',
        name: 'Assortiment de Macarons Français',
        category: 'Food',
        subcategory: 'macarons',
        priceCents: 2450,
        description: 'Coffret premium de 12 macarons artisanaux : Framboise, Pistache, Chocolat, Vanille, Citron et Caramel beurre salé. Authentique recette de Paris.',
        images: [
            'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Quantité',
                type: 'text',
                options: [
                    { value: '12 pièces' },
                    { value: '24 pièces' },
                    { value: '36 pièces' }
                ]
            },
            {
                label: 'Saveurs',
                type: 'text',
                options: [
                    { value: 'Assortiment' },
                    { value: 'Fruits rouges' },
                    { value: 'Chocolat' }
                ]
            }
        ],
        characteristics: [
            { label: 'Contenu', value: '12 macarons variés' },
            { label: 'Saveurs', value: 'Framboise, Pistache, Chocolat, Vanille, Citron, Caramel' },
            { label: 'Poids net', value: '200 g' },
            { label: 'Conservation', value: '5 jours au réfrigérateur' },
            { label: 'Allergènes', value: 'Œufs, fruits à coques, gluten' },
            { label: 'Origine', value: 'Fabriqué en France (Paris)' },
            { label: 'Sans conservateurs', value: 'Oui' },
        ]
    },
    {
        id: '202',
        name: 'Café Grains Torréfaction Italienne',
        category: 'Food',
        subcategory: 'café',
        priceCents: 1590,
        description: 'Sachet de 1kg pur Arabica. Parfait pour les machines à expresso, riche en arômes avec des notes intenses de cacao et noisette.',
        images: [
            'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Volume',
                type: 'text',
                options: [
                    { value: '500 g' },
                    { value: '1 kg' },
                    { value: '2 kg' }
                ]
            },
            {
                label: 'Mouture',
                type: 'text',
                options: [
                    { value: 'Grains entiers' },
                    { value: 'Mouture fine' },
                    { value: 'Mouture moyenne' }
                ]
            }
        ],
        characteristics: [
            { label: 'Type de café', value: 'Pur Arabica' },
            { label: 'Origine', value: 'Mélange Italie / Éthiopie' },
            { label: 'Torréfaction', value: 'Italienne (intense)' },
            { label: 'Notes', value: 'Cacao, Noisette' },
            { label: 'Format', value: 'Grains entiers' },
            { label: 'Poids', value: '1 kg' },
            { label: 'Intensité', value: '9/10' },
            { label: 'Compatible', value: 'Machine espresso, Cafetière filtre' },
        ]
    },
    {
        id: '301',
        name: 'T-Shirt Basique en Coton Bio',
        category: 'Clothing',
        subcategory: 't-shirt',
        priceCents: 1999,
        description: 'T-Shirt blanc intemporel. Coupe droite, 100% coton biologique très doux. Fabriqué de manière éthique, le vêtement essentiel par excellence.',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Taille',
                type: 'text',
                options: [
                    { value: 'XS' },
                    { value: 'S' },
                    { value: 'M' },
                    { value: 'L' },
                    { value: 'XL' }
                ]
            },
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Blanc', color: '#f5f5f5' },
                    { value: 'Noir', color: '#1a1a1a' },
                    { value: 'Gris', color: '#888' }
                ]
            }
        ],
        characteristics: [
            { label: 'Matière', value: '100% coton biologique' },
            { label: 'Coupe', value: 'Regular / Droite' },
            { label: 'Couleur', value: 'Blanc' },
            { label: 'Certification', value: 'GOTS (Textile Biologique)' },
            { label: 'Lavage', value: '30°C, ne pas sécher au sèche-linge' },
            { label: 'Origine', value: 'Fabriqué au Portugal' },
            { label: 'Emballage', value: 'Emballage recyclé' },
        ]
    },
    {
        id: '302',
        name: 'Veste en Jean Denim Vintage',
        category: 'Clothing',
        subcategory: 'veste en jean',
        priceCents: 5900,
        description: 'Veste robuste et stylée pour l\'automne. Aspect délavé unique avec coutures renforcées. Un véritable classique de la mode urbaine.',
        images: [
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Taille',
                type: 'text',
                options: [
                    { value: 'S' },
                    { value: 'M' },
                    { value: 'L' },
                    { value: 'XL' }
                ]
            },
            {
                label: 'Couleur',
                type: 'color',
                options: [
                    { value: 'Bleu délavé', color: '#4a6fa5' },
                    { value: 'Noir', color: '#1a1a1a' }
                ]
            }
        ],
        characteristics: [
            { label: 'Matière', value: '100% coton denim' },
            { label: 'Style', value: 'Vintage / Délavé' },
            { label: 'Fermeture', value: 'Boutons en métal' },
            { label: 'Poches', value: '4 (2 avant, 2 poitrine)' },
            { label: 'Couleur', value: 'Bleu Indigo Délavé' },
            { label: 'Lavage', value: '40°C, retourner avant lavage' },
            { label: 'Origine', value: 'Fabriqué en Turquie' },
        ]
    },
    {
        id: '103',
        name: 'Montre Connectée Sport Pro',
        category: 'Electronics',
        subcategory: 'montre',
        priceCents: 24900,
        description: 'Suivez vos performances sportives et votre santé. Écran OLED circulaire, GPS intégré, étanche jusqu\'à 50 mètres. Jusqu\'à 14 jours de batterie.',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
        ],
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        variants: [
            {
                label: 'Couleur bracelet',
                type: 'color',
                options: [
                    { value: 'Noir', color: '#1a1a1a' },
                    { value: 'Bleu Nuit', color: '#1e3a5f' },
                    { value: 'Corail', color: '#e07060' }
                ]
            },
            {
                label: 'Taille de boîtier',
                type: 'text',
                options: [
                    { value: '42 mm' },
                    { value: '46 mm' }
                ]
            }
        ],
        characteristics: [
            { label: 'Écran', value: 'OLED circulaire 1.4"' },
            { label: 'GPS', value: 'Intégré' },
            { label: 'Étanchéité', value: '50 m (5ATM)' },
            { label: 'Autonomie', value: 'Jusqu\'à 14 jours' },
            { label: 'Capteurs', value: 'FC, SpO2, Altimètre, Baromètre' },
            { label: 'Sports', value: '+100 modes sportifs' },
            { label: 'Compatibilité', value: 'iOS 14+ / Android 8+' },
            { label: 'Poids', value: '38 g (sans bracelet)' },
        ]
    },
    {
        id: '203',
        name: 'Miel de Montagne Artisanal',
        category: 'Food',
        subcategory: 'miel',
        priceCents: 1250,
        description: 'Pot de 500g de miel de fleurs sauvages. Récolté dans les Alpes de haute montagne. Saveur riche, 100% naturel sans additifs.',
        images: [
            'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
        ],
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
        variants: [
            {
                label: 'Volume',
                type: 'text',
                options: [
                    { value: '250 g' },
                    { value: '500 g' },
                    { value: '1 kg' }
                ]
            },
            {
                label: 'Type',
                type: 'text',
                options: [
                    { value: 'Fleurs sauvages' },
                    { value: 'Acacia' },
                    { value: 'Lavande' }
                ]
            }
        ],
        characteristics: [
            { label: 'Type', value: 'Miel de fleurs sauvages' },
            { label: 'Origine', value: 'Alpes françaises (Hautes-Alpes)' },
            { label: 'Poids', value: '500 g' },
            { label: 'Récolte', value: 'Manuelle / Artisanale' },
            { label: 'Pasteurisé', value: 'Non' },
            { label: 'Additifs', value: 'Aucun – 100% naturel' },
            { label: 'Conservation', value: '2 ans dans un endroit frais et sec' },
            { label: 'Certifié Bio', value: 'Oui' },
        ]
    }
];

export const reviews = [
    // MacBook (101)
    { id: 'r1', itemId: '101', userId: 'u1', stars: 5, date: '2026-01-10', reviewText: 'Machine exceptionnelle, la puissance de la puce M3 Max est au rendez-vous !' },
    { id: 'r2', itemId: '101', userId: 'u2', stars: 4, date: '2026-01-22', reviewText: 'Très rapide, mais le prix reste un peu excessif pour un usage non professionnel.' },
    { id: 'r3', itemId: '101', userId: 'u3', stars: 5, date: '2026-02-05', reviewText: 'L\'autonomie de la batterie est bluffante, je le recharge tous les 2 jours.' },
    { id: 'r4', itemId: '101', userId: 'u4', stars: 5, date: '2026-02-17', reviewText: 'Qualité d\'écran inégalable. Parfait pour le montage vidéo XDR.' },
    { id: 'r5', itemId: '101', userId: 'u5', stars: 4, date: '2026-03-01', reviewText: 'Un peu lourd à transporter comparer au Macbook Air, mais la puissance compense.' },

    // Casque Audio (102)
    { id: 'r6', itemId: '102', userId: 'u6', stars: 5, date: '2025-12-15', reviewText: 'Réduction de bruit absolument magique dans les transports en commun.' },
    { id: 'r7', itemId: '102', userId: 'u7', stars: 5, date: '2026-01-08', reviewText: 'Qualité de fabrication superbe, et très confortable sur les oreilles.' },
    { id: 'r8', itemId: '102', userId: 'u8', stars: 4, date: '2026-01-30', reviewText: 'Excellent casque, mais l\'étui de transport ne se plie plus comme la version précédente.' },
    { id: 'r9', itemId: '102', userId: 'u1', stars: 5, date: '2026-02-12', reviewText: 'Basses profondes et claires sans dénaturer la musique.' },
    { id: 'r10', itemId: '102', userId: 'u2', stars: 3, date: '2026-03-05', reviewText: 'Le micro pour les appels téléphoniques attrape un peu trop le vent dehors.' },

    // Montre (103)
    { id: 'r11', itemId: '103', userId: 'u3', stars: 5, date: '2026-01-14', reviewText: 'Très précise pour le running et le vélo. Application compagnon super intuitive.' },
    { id: 'r12', itemId: '103', userId: 'u4', stars: 4, date: '2026-01-27', reviewText: 'Design élégant et sportif. Se raye facilement si on ne fait pas attention.' },
    { id: 'r13', itemId: '103', userId: 'u5', stars: 5, date: '2026-02-09', reviewText: 'Autonomie de folie, tient facile 2 semaines sans GPS activé!' },
    { id: 'r14', itemId: '103', userId: 'u6', stars: 4, date: '2026-02-22', reviewText: 'Dommage que toutes les applications tierces ne soient pas compatibles.' },
    { id: 'r15', itemId: '103', userId: 'u7', stars: 5, date: '2026-03-10', reviewText: 'Le suivi du sommeil est extrêmement précis et utile.' },

    // Macarons (201)
    { id: 'r16', itemId: '201', userId: 'u8', stars: 5, date: '2025-12-20', reviewText: 'Délicieux! Ils fondent dans la bouche avec une ganache parfaite.' },
    { id: 'r17', itemId: '201', userId: 'u1', stars: 5, date: '2026-01-05', reviewText: 'Parfait pour offrir. Emballage très soigné et macarons intacts à l\'arrivée.' },
    { id: 'r18', itemId: '201', userId: 'u2', stars: 4, date: '2026-01-19', reviewText: 'Le goût pistache manque un peu de puissance, mais caramel beurre salé est divin.' },
    { id: 'r19', itemId: '201', userId: 'u3', stars: 4, date: '2026-02-03', reviewText: 'Un peu cher pour 12 macarons mais la qualité artisanale se sent tout de suite.' },
    { id: 'r20', itemId: '201', userId: 'u4', stars: 5, date: '2026-03-08', reviewText: 'Une tuerie internationale !' },

    // Café (202)
    { id: 'r21', itemId: '202', userId: 'u5', stars: 5, date: '2025-11-10', reviewText: 'Très bon café corsé ! Parfait pour l\'espresso du matin.' },
    { id: 'r22', itemId: '202', userId: 'u6', stars: 3, date: '2025-12-01', reviewText: 'Grains un peu trop gras à mon goût pour ma machine broyeur.' },
    { id: 'r23', itemId: '202', userId: 'u7', stars: 4, date: '2026-01-15', reviewText: 'Arôme noisette/cacao subtile, très agréable sans amertume.' },
    { id: 'r24', itemId: '202', userId: 'u8', stars: 5, date: '2026-02-08', reviewText: 'Rapport qualité/prix imbattable pour de la torréfaction italienne locale.' },
    { id: 'r25', itemId: '202', userId: 'u1', stars: 5, date: '2026-03-12', reviewText: 'Déjà ma 5ème commande et toujours une qualité constante.' },

    // Miel (203)
    { id: 'r26', itemId: '203', userId: 'u2', stars: 5, date: '2025-10-20', reviewText: 'Le meilleur miel naturel que j\'ai pu goûter depuis mon enfance.' },
    { id: 'r27', itemId: '203', userId: 'u3', stars: 5, date: '2025-11-15', reviewText: 'Un parfum floral incroyable, idéal sur des tartines beurrées !' },
    { id: 'r28', itemId: '203', userId: 'u4', stars: 4, date: '2025-12-10', reviewText: 'Cristallise un peu vite, mais cela prouve qu\'il est vraiment brut et sans additif.' },
    { id: 'r29', itemId: '203', userId: 'u5', stars: 5, date: '2026-01-18', reviewText: 'Texture onctueuse, on ressent vraiment les fleurs de montagne.' },
    { id: 'r30', itemId: '203', userId: 'u6', stars: 5, date: '2026-02-25', reviewText: 'Pot en verre très qualitatif, je recommande fortement.' },

    // T-Shirt (301)
    { id: 'r31', itemId: '301', userId: 'u7', stars: 4, date: '2025-12-05', reviewText: 'Coton de bonne facture et épais, mais attention ça taille un peu large.' },
    { id: 'r32', itemId: '301', userId: 'u8', stars: 5, date: '2026-01-12', reviewText: 'Idéal et basique. Se porte avec tout, très confortable et responsable.' },
    { id: 'r33', itemId: '301', userId: 'u1', stars: 5, date: '2026-01-28', reviewText: 'A survécu à 20 lavages sans se déformer ni boulocher. Excellent produit.' },
    { id: 'r34', itemId: '301', userId: 'u2', stars: 4, date: '2026-02-14', reviewText: 'Manches légèrement trop courtes pour les grands gabarits.' },
    { id: 'r35', itemId: '301', userId: 'u3', stars: 5, date: '2026-03-05', reviewText: 'Doux au contact de la peau, le coton bio change tout.' },

    // Veste (302)
    { id: 'r36', itemId: '302', userId: 'u4', stars: 5, date: '2025-11-20', reviewText: 'Magnifique teinte vintage, le délavage rend super bien en vrai.' },
    { id: 'r37', itemId: '302', userId: 'u5', stars: 4, date: '2025-12-18', reviewText: 'La veste est bien lourde, on sent que la toile denim est solide.' },
    { id: 'r38', itemId: '302', userId: 'u6', stars: 3, date: '2026-01-09', reviewText: 'Boutons un peu durs à attacher les premiers jours.' },
    { id: 'r39', itemId: '302', userId: 'u7', stars: 5, date: '2026-02-01', reviewText: 'Un classique indémodable, se rajoute parfaitement au dessus d\'un hoodie.' },
    { id: 'r40', itemId: '302', userId: 'u8', stars: 5, date: '2026-03-15', reviewText: 'Qualité au top, très chaude pour l\'automne/printemps.' },
];