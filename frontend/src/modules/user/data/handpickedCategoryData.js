/** BlueStone-style curated category thumbnails for Handpicked section */
import ringsImg from '../assets/cat_rings_ruby.jpg';
import earringsImg from '../assets/cat_earrings_trad.jpg';
import pendantsImg from '../assets/cat_pendant.png';
import chainsImg from '../assets/new_launch_chains.png';
import necklacesImg from '../assets/cat_necklaces_emerald.jpg';
import banglesImg from '../assets/new_launch_bracelets.png';
import braceletsImg from '../assets/cat_bracelets.png';
import mangalsutraImg from '../assets/kundan_necklace.png';
import nosePinsImg from '../assets/silver_pendant.png';
import solitairesImg from '../assets/diamond_solitaire.png';
import kidsImg from '../assets/nav_gift_kids.png';
import kadaImg from '../assets/cat_bracelet_wine.png';
import mensImg from '../assets/nav_gift_mens.png';
import ankletsImg from '../assets/new_launch_anklets.png';

const watchAccessoriesImg =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=240&h=240&q=90';

export const HANDPICKED_CATEGORY_DEFS = [
    { key: 'rings', name: 'Rings', image: ringsImg },
    { key: 'earrings', name: 'Earrings', image: earringsImg },
    { key: 'pendants', name: 'Pendants', image: pendantsImg },
    { key: 'chains', name: 'Chains', image: chainsImg },
    { key: 'necklaces', name: 'Necklaces', image: necklacesImg },
    { key: 'bangles', name: 'Bangles', image: banglesImg },
    { key: 'bracelets', name: 'Bracelets', image: braceletsImg },
    { key: 'mangalsutra', name: 'Mangalsutra', image: mangalsutraImg },
    { key: 'nose-pins', name: 'Nose Pins', image: nosePinsImg },
    { key: 'solitaires', name: 'Solitaires', image: solitairesImg },
    { key: 'kids-jewellery', name: "Kids' Jewellery", image: kidsImg },
    { key: 'kada', name: 'Kada', image: kadaImg },
    { key: 'mens-jewellery', name: "Men's Jewellery", image: mensImg },
    { key: 'watch-accessories', name: 'Watch Accessories', image: watchAccessoriesImg },
    { key: 'anklets', name: 'Anklets', image: ankletsImg },
];

const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export function buildHandpickedCategories(dbCategories = []) {
    const jewelleryDb = dbCategories.filter(
        (c) =>
            c.department?.toLowerCase() === 'jewellery' &&
            c.status === 'Active'
    );

    return HANDPICKED_CATEGORY_DEFS.map((def) => {
        const dbMatch = jewelleryDb.find(
            (c) =>
                normalize(c.name) === normalize(def.name) ||
                normalize(c.id || c._id) === normalize(def.key) ||
                normalize(c.name).includes(normalize(def.key))
        );

        return {
            id: dbMatch?.id || dbMatch?._id || def.key,
            name: def.name,
            image: def.image,
            fallbackImage: def.image,
            slug: def.key,
        };
    });
}
