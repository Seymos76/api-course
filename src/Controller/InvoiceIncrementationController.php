<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class InvoiceIncrementationController
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @Route(path="/invoices/{id}/increment")
     * @param Invoice $data
     */
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono()+1);
        $this->manager->flush();
        dd($data);
    }
}
